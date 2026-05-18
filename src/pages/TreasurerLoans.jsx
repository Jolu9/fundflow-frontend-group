import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

export default function TreasurerLoans() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [reviewForm, setReviewForm] = useState({ interest_rate: "", due_date: "" });
  const [form, setForm] = useState({ user_id: "", amount: "", interest_rate: "10", due_date: "", purpose: "" });
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    fetchLoans();
    axios.get(`${API}/users`, { headers }).then(res => setMembers(res.data.filter(u => u.role === "member"))).catch(() => {});
  }, []);

  const fetchLoans = () => {
    axios.get(`${API}/loans`, { headers }).then(res => setLoans(res.data)).catch(() => {});
  };

  const handleSubmit = async () => {
    if (!form.user_id || !form.amount || !form.interest_rate || !form.due_date) { setError("All fields except purpose are required."); return; }
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/loans`, form, { headers });
      setForm({ user_id: "", amount: "", interest_rate: "10", due_date: "", purpose: "" });
      setShowForm(false);
      fetchLoans();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to issue loan.");
    }
    setLoading(false);
  };

  const handleApprove = async () => {
  if (!reviewForm.interest_rate || !reviewForm.due_date) { 
    setReviewError("Interest rate and due date are required to approve."); 
    return; 
  }
  
  const interest = Number(reviewForm.interest_rate);
  const amount = Number(selectedLoan.amount);
  const total_due = amount + (amount * interest / 100);
  
  try {
    await axios.patch(`${API}/loans/${selectedLoan.id}`, {
      status: "active",
      interest_rate: interest,
      due_date: reviewForm.due_date,
      total_due: total_due,
    }, { headers });
    setSelectedLoan(null);
    setReviewForm({ interest_rate: "", due_date: "" });
    fetchLoans();
  } catch (err) {
    setReviewError("Failed to approve loan. Please try again.");
  }
};

  const handleReject = async () => {
    await axios.patch(`${API}/loans/${selectedLoan.id}`, { status: "rejected" }, { headers });
    setSelectedLoan(null);
    fetchLoans();
  };

  const handleRecordPayment = (loan) => {
    navigate(`/treasurer/repayments?loan=${loan.id}`);
  };

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const statusBadge = (status) => {
    const styles = {
      active: { background: "rgba(74,222,128,0.15)", color: "#16A34A" },
      overdue: { background: "rgba(248,113,113,0.15)", color: "#DC2626" },
      completed: { background: "rgba(102,126,234,0.15)", color: "#667EEA" },
      pending: { background: "rgba(251,191,36,0.15)", color: "#D97706" },
      rejected: { background: "rgba(156,163,175,0.15)", color: "#6B7280" },
    };
    const s = styles[status] || {};
    return <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, ...s }}>{status}</span>;
  };

  return (
    <Layout user={user} onLogout={logout} role="treasurer" activePath="/treasurer/loans">

      {/* REVIEW MODAL */}
      {selectedLoan && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F0C29" }}>Review Loan Application</h3>
              <button onClick={() => { setSelectedLoan(null); setReviewError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={20} /></button>
            </div>

            {/* LOAN DETAILS */}
            <div style={{ background: "#F8F9FF", borderRadius: 10, padding: 16, marginBottom: 24, border: "1px solid #EAECF0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  ["Member", selectedLoan.user?.name],
                  ["Requested Amount", `K${Number(selectedLoan.amount).toLocaleString()}`],
                  ["Status", selectedLoan.status],
                  ["Applied On", new Date(selectedLoan.created_at).toLocaleDateString()],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0F0C29" }}>{value}</div>
                  </div>
                ))}
              </div>
              {selectedLoan.purpose && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #EAECF0" }}>
                  <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, marginBottom: 4 }}>Purpose</div>
                  <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{selectedLoan.purpose}</div>
                </div>
              )}
            </div>

            {selectedLoan.status === "pending" && (
              <>
                {reviewError && <div style={{ background: "#FFF0F0", border: "1px solid #FFCDD2", color: "#C62828", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{reviewError}</div>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Interest Rate (%)</label>
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      value={reviewForm.interest_rate}
                      onChange={e => setReviewForm({ ...reviewForm, interest_rate: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Due Date</label>
                    <input
                      type="date"
                      value={reviewForm.due_date}
                      onChange={e => setReviewForm({ ...reviewForm, due_date: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                {(reviewForm.interest_rate || reviewForm.due_date) && (
  <div style={{ background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#276749" }}>
    {reviewForm.interest_rate && (
      <div>Interest: {reviewForm.interest_rate}%</div>
    )}
    {reviewForm.interest_rate && (
      <div>Total due: <strong>K{(Number(selectedLoan.amount) + (Number(selectedLoan.amount) * Number(reviewForm.interest_rate) / 100)).toLocaleString()}</strong></div>
    )}
    {reviewForm.due_date && (
      <div>Due date: {reviewForm.due_date}</div>
    )}
  </div>
)}

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={handleApprove} style={{ flex: 1, padding: "11px", background: "linear-gradient(135deg, #667EEA, #764BA2)", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                    Approve Loan
                  </button>
                  <button onClick={handleReject} style={{ flex: 1, padding: "11px", background: "#FFF0F0", color: "#DC2626", border: "1px solid #FFCDD2", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                    Reject
                  </button>
                </div>
              </>
            )}

            {selectedLoan.status !== "pending" && (
              <div style={{ textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
                This loan has already been {selectedLoan.status}.
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ background: "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)", borderRadius: 16, padding: "32px 36px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 800 140" preserveAspectRatio="xMidYMid slice">
          <defs><pattern id="tg" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/></pattern></defs>
          <rect width="800" height="140" fill="url(#tg)"/>
          <circle cx="700" cy="20" r="120" fill="rgba(102,126,234,0.1)"/>
        </svg>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Treasurer Panel</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Loans</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{loans.length} total loans</p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "10px 22px", background: "linear-gradient(135deg, #667EEA, #764BA2)", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif", boxShadow: "0 4px 14px rgba(102,126,234,0.35)" }}>
          + Issue loan
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", borderRadius: 14, padding: 28, marginBottom: 24, border: "1px solid #EAECF0" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F0C29", marginBottom: 20 }}>Issue new loan directly</h3>
          {error && <div style={{ background: "#FFF0F0", border: "1px solid #FFCDD2", color: "#C62828", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Member</label>
              <select value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", outline: "none" }}>
                <option value="">Select member</option>
                {members.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            {[["Amount (K)", "amount", "number"], ["Interest Rate (%)", "interest_rate", "number"], ["Due Date", "due_date", "date"], ["Purpose", "purpose", "text"]].map(([label, key, type]) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleSubmit} disabled={loading} style={{ padding: "10px 24px", background: "linear-gradient(135deg, #667EEA, #764BA2)", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
              {loading ? "Issuing..." : "Issue loan"}
            </button>
            <button onClick={() => { setShowForm(false); setError(""); }} style={{ padding: "10px 24px", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EAECF0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Member", "Amount", "Interest", "Total Due", "Paid", "Due Date", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#667085", borderBottom: "1px solid #EAECF0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>No loans yet.</td></tr>
            ) : loans.map(loan => (
              <tr key={loan.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#0F0C29" }}>{loan.user?.name ?? "—"}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>K{Number(loan.amount).toLocaleString()}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>{loan.interest_rate}%</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>K{Number(loan.total_due).toLocaleString()}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>K{Number(loan.amount_paid).toLocaleString()}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>{loan.due_date || "—"}</td>
                <td style={{ padding: "14px 16px" }}>{statusBadge(loan.status)}</td>
                <td style={{ padding: "14px 16px", display: "flex", gap: 8, alignItems: "center" }}>
                  {loan.status === "pending" && (
                    <button onClick={() => { setSelectedLoan(loan); setReviewForm({ interest_rate: "", due_date: "" }); setReviewError(""); }}
                      style={{ padding: "5px 14px", background: "rgba(102,126,234,0.1)", color: "#667EEA", border: "1px solid rgba(102,126,234,0.2)", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                      Review
                    </button>
                  )}
                  {loan.status === "active" && (
                    <>
                      <button onClick={() => { setSelectedLoan(loan); setReviewError(""); }}
                        style={{ padding: "5px 14px", background: "rgba(102,126,234,0.1)", color: "#667EEA", border: "1px solid rgba(102,126,234,0.2)", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                        Details
                      </button>
                      <button onClick={() => handleRecordPayment(loan)}
                        style={{ padding: "5px 14px", background: "rgba(74,222,128,0.15)", color: "#16A34A", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                        Payment
                      </button>
                    </>
                  )}
                  {(loan.status === "completed" || loan.status === "rejected") && (
                    <button onClick={() => { setSelectedLoan(loan); }}
                      style={{ padding: "5px 14px", background: "#F3F4F6", color: "#6B7280", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
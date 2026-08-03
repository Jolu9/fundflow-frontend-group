import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #E8EAED",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

export default function MemberRepayments() {
  const [user, setUser] = useState(null);
  const [repayments, setRepayments] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [form, setForm] = useState({ loan_id: "", amount: "", reference_note: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchRepayments = () => {
    axios.get(`${API}/member/repayments`, { headers }).then(res => setRepayments(res.data)).catch(() => {});
  };

  const fetchRequests = () => {
    axios.get(`${API}/repayment-requests/mine`, { headers }).then(res => {
      setPendingRequests(res.data.filter(r => r.status === "pending"));
    }).catch(() => {});
  };

  const fetchLoans = () => {
    axios.get(`${API}/member/loans`, { headers }).then(res => {
      setActiveLoans(res.data.filter(l => l.status === "active"));
    }).catch(() => {});
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    fetchRepayments();
    fetchRequests();
    fetchLoans();
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const handleSubmit = async () => {
    if (!form.loan_id || !form.amount) { setError("Please select a loan and enter an amount."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      await axios.post(`${API}/repayment-requests`, {
        loan_id: parseInt(form.loan_id),
        amount: parseFloat(form.amount),
        reference_note: form.reference_note || null,
      }, { headers });
      setSuccess("Repayment submitted — awaiting treasurer confirmation.");
      setForm({ loan_id: "", amount: "", reference_note: "" });
      fetchRequests();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to submit repayment.");
    }
    setLoading(false);
  };

  const total = repayments.reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <Layout user={user} onLogout={logout} role="member" activePath="/member/repayments">

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Repayments</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>
          {repayments.length} repayment{repayments.length !== 1 ? "s" : ""}
          {repayments.length > 0 && <> · <span style={{ fontWeight: 600, color: "#059669" }}>K{total.toLocaleString()} total paid</span></>}
        </p>
      </div>

      {/* REPAYMENT FORM */}
      {activeLoans.length > 0 && (
        <div style={{ ...card, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 18 }}>Make a Repayment</h3>

          {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 14 }}>{error}</div>}
          {success && <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 14 }}>{success}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Select Loan</label>
              <select value={form.loan_id} onChange={e => setForm({ ...form, loan_id: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none" }}>
                <option value="">Select active loan</option>
                {activeLoans.map(l => {
                  const remaining = Number(l.total_due) - Number(l.amount_paid);
                  return (
                    <option key={l.id} value={l.id}>
                      K{Number(l.amount).toLocaleString()} — K{remaining.toLocaleString()} remaining
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Amount (K)</label>
              <input type="number" placeholder="e.g. 500" value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
                onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Reference / Notes (optional)</label>
            <input type="text" placeholder="e.g. Mobile money ref #12345" value={form.reference_note}
              onChange={e => setForm({ ...form, reference_note: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
              onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{ padding: "10px 28px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {loading ? "Submitting..." : "Submit Repayment"}
          </button>
        </div>
      )}

      {/* NO ACTIVE LOANS MESSAGE */}
      {activeLoans.length === 0 && (
        <div style={{ ...card, padding: "18px 22px", marginBottom: 20, fontSize: 13, color: "#9CA3AF" }}>
          You have no active loans to repay.
        </div>
      )}

      {/* PENDING REQUESTS */}
      {pendingRequests.length > 0 && (
        <div style={{ ...card, padding: 0, overflow: "hidden", marginBottom: 24 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #E8EAED" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Pending Confirmation</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {pendingRequests.map(r => (
              <div key={r.id} style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid #F3F4F6" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={15} color="#D97706" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>K{Number(r.amount).toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>{r.reference_note || "No reference note"}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, background: "#FEF3C7", color: "#D97706", padding: "3px 10px", borderRadius: 20 }}>Awaiting confirmation</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HISTORY TABLE */}
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #E8EAED" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Repayment History</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Date", "Loan Amount", "Amount Paid", "Notes"].map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #E8EAED" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {repayments.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No confirmed repayments yet.</td></tr>
            ) : repayments.map(r => (
              <tr key={r.id} style={{ borderBottom: "1px solid #F3F4F6" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280" }}>
                  {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: "#111827" }}>K{Number(r.loan?.amount).toLocaleString()}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 700, color: "#059669" }}>K{Number(r.amount).toLocaleString()}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280" }}>{r.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
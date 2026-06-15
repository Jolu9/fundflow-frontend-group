import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

export default function TreasurerLoans() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [members, setMembers] = useState([]);
  const [community, setCommunity] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [reviewForm, setReviewForm] = useState({ interest_rate: "", due_date: "" });
  const [form, setForm] = useState({ user_id: "", amount: "", interest_rate: "10", due_date: "", purpose: "" });
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedMembers, setExpandedMembers] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = () => {
    axios.get(`${API}/communities/my`, { headers }).then(commRes => {
      if (commRes.data.length === 0) return;
      const myComm = commRes.data[0];
      setCommunity(myComm);
      const communityMembers = myComm.members?.filter(m => m.pivot?.role === "member") ?? [];
      setMembers(communityMembers);

      axios.get(`${API}/loans`, { headers }).then(res => {
        const filtered = res.data.filter(l => l.community_id === myComm.id);
        setLoans(filtered);

        // Auto-expand members with pending loans
        const autoExpand = {};
        filtered.filter(l => l.status === "pending").forEach(l => {
          autoExpand[l.user_id] = true;
        });
        setExpandedMembers(prev => ({ ...prev, ...autoExpand }));
      }).catch(() => {});
    }).catch(() => {});
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    fetchData();
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const handleSubmit = async () => {
    if (!form.user_id || !form.amount || !form.interest_rate || !form.due_date) { setError("All fields except purpose are required."); return; }
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/loans`, form, { headers });
      setForm({ user_id: "", amount: "", interest_rate: "10", due_date: "", purpose: "" });
      setShowForm(false);
      fetchData();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to issue loan.");
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!reviewForm.interest_rate || !reviewForm.due_date) { setReviewError("Interest rate and due date are required."); return; }
    const interest = Number(reviewForm.interest_rate);
    const amount = Number(selectedLoan.amount);
    const total_due = amount + (amount * interest / 100);
    try {
      await axios.patch(`${API}/loans/${selectedLoan.id}`, { status: "active", interest_rate: interest, due_date: reviewForm.due_date, total_due }, { headers });
      setSelectedLoan(null);
      setReviewForm({ interest_rate: "", due_date: "" });
      fetchData();
    } catch { setReviewError("Failed to approve loan."); }
  };

  const handleReject = async () => {
    await axios.patch(`${API}/loans/${selectedLoan.id}`, { status: "rejected" }, { headers });
    setSelectedLoan(null);
    fetchData();
  };

  const toggleMember = (userId) => {
    setExpandedMembers(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  // Group loans by member
  const grouped = members.map(member => {
    const memberLoans = loans.filter(l => l.user_id === member.id);
    const totalDue = memberLoans.reduce((sum, l) => sum + Number(l.total_due), 0);
    const totalPaid = memberLoans.reduce((sum, l) => sum + Number(l.amount_paid), 0);
    const hasPending = memberLoans.some(l => l.status === "pending");
    const hasOverdue = memberLoans.some(l => l.status === "overdue");
    return { member, loans: memberLoans, totalDue, totalPaid, hasPending, hasOverdue };
  }).filter(g => g.loans.length > 0);

  const statusBadge = (status) => {
    const styles = {
      active: { background: "#ECFDF5", color: "#059669" },
      overdue: { background: "#FEF2F2", color: "#DC2626" },
      completed: { background: "#EFF6FF", color: "#2563EB" },
      pending: { background: "#FEF3C7", color: "#D97706" },
      rejected: { background: "#F3F4F6", color: "#6B7280" },
    };
    return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, ...(styles[status] || {}) }}>{status}</span>;
  };

  const inputStyle = { width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };

  return (
    <Layout user={user} onLogout={logout} role="treasurer" activePath="/treasurer/loans">

      {/* REVIEW MODAL */}
      {selectedLoan && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 32, width: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                {selectedLoan.status === "pending" ? "Review Loan Application" : "Loan Details"}
              </h3>
              <button onClick={() => { setSelectedLoan(null); setReviewError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={18} /></button>
            </div>

            <div style={{ background: "#F9FAFB", borderRadius: 8, padding: 16, marginBottom: 24, border: "1px solid #E5E7EB" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  ["Member", selectedLoan.user?.name],
                  ["Amount", `K${Number(selectedLoan.amount).toLocaleString()}`],
                  ["Status", selectedLoan.status],
                  ["Applied On", new Date(selectedLoan.created_at).toLocaleDateString()],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", textTransform: "capitalize" }}>{value}</div>
                  </div>
                ))}
              </div>
              {selectedLoan.purpose && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E5E7EB" }}>
                  <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, marginBottom: 4 }}>Purpose</div>
                  <div style={{ fontSize: 13, color: "#374151" }}>{selectedLoan.purpose}</div>
                </div>
              )}
            </div>

            {selectedLoan.status === "pending" && (
              <>
                {reviewError && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 16 }}>{reviewError}</div>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Interest Rate (%)</label>
                    <input type="number" placeholder="e.g. 10" value={reviewForm.interest_rate} onChange={e => setReviewForm({ ...reviewForm, interest_rate: e.target.value })} style={inputStyle}
                      onFocus={e => e.target.style.border = "1.5px solid #2563EB"} onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Due Date</label>
                    <input type="date" value={reviewForm.due_date} onChange={e => setReviewForm({ ...reviewForm, due_date: e.target.value })} style={inputStyle}
                      onFocus={e => e.target.style.border = "1.5px solid #2563EB"} onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
                  </div>
                </div>
                {reviewForm.interest_rate && (
                  <div style={{ background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 7, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#276749" }}>
                    Total due: <strong>K{(Number(selectedLoan.amount) + (Number(selectedLoan.amount) * Number(reviewForm.interest_rate) / 100)).toLocaleString()}</strong>
                  </div>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handleApprove} style={{ flex: 1, padding: "10px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Approve</button>
                  <button onClick={handleReject} style={{ flex: 1, padding: "10px", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Reject</button>
                </div>
              </>
            )}
            {selectedLoan.status !== "pending" && (
              <div style={{ textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>This loan has already been {selectedLoan.status}.</div>
            )}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Loans</h1>
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>
            {loans.length} loan{loans.length !== 1 ? "s" : ""} across {grouped.length} member{grouped.length !== 1 ? "s" : ""}
            {community ? ` in ${community.name}` : ""}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          + Issue Loan
        </button>
      </div>

      {/* ISSUE FORM */}
      {showForm && (
        <div style={{ background: "#fff", borderRadius: 10, padding: 24, marginBottom: 20, border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 20 }}>Issue new loan</h3>
          {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Member</label>
              <select value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })}
                style={{ ...inputStyle }}>
                <option value="">Select member</option>
                {members.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            {[["Amount (K)", "amount", "number"], ["Interest Rate (%)", "interest_rate", "number"], ["Due Date", "due_date", "date"], ["Purpose", "purpose", "text"]].map(([label, key, type]) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle}
                  onFocus={e => e.target.style.border = "1.5px solid #2563EB"} onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleSubmit} disabled={loading} style={{ padding: "9px 24px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {loading ? "Issuing..." : "Issue Loan"}
            </button>
            <button onClick={() => { setShowForm(false); setError(""); }} style={{ padding: "9px 20px", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 7, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* GROUPED MEMBERS */}
      {grouped.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E5E7EB", padding: "48px 24px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
          No loans yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {grouped.map(({ member, loans: memberLoans, totalDue, totalPaid, hasPending, hasOverdue }) => {
            const isExpanded = expandedMembers[member.id] ?? false;
            const remaining = totalDue - totalPaid;
            const progress = totalDue > 0 ? Math.min((totalPaid / totalDue) * 100, 100) : 0;

            return (
              <div key={member.id} style={{ background: "#fff", borderRadius: 10, border: `1px solid ${hasPending ? "#FDE68A" : hasOverdue ? "#FECACA" : "#E5E7EB"}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden" }}>

                {/* Member header row */}
                <div onClick={() => toggleMember(member.id)}
                  style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", background: hasPending ? "#FFFBEB" : hasOverdue ? "#FFF5F5" : "#fff" }}>

                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                    {member.name?.[0]?.toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{member.name}</div>
                      {hasPending && <span style={{ fontSize: 10, fontWeight: 700, background: "#FEF3C7", color: "#D97706", padding: "2px 7px", borderRadius: 10 }}>PENDING REVIEW</span>}
                      {hasOverdue && <span style={{ fontSize: 10, fontWeight: 700, background: "#FEF2F2", color: "#DC2626", padding: "2px 7px", borderRadius: 10 }}>OVERDUE</span>}
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <div style={{ flex: 1, background: "#F3F4F6", borderRadius: 99, height: 5, maxWidth: 180 }}>
                        <div style={{ width: `${progress}%`, background: hasOverdue ? "#DC2626" : "#2563EB", height: 5, borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>K{totalPaid.toLocaleString()} of K{totalDue.toLocaleString()}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: remaining > 0 ? "#DC2626" : "#059669" }}>K{remaining.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{memberLoans.length} loan{memberLoans.length !== 1 ? "s" : ""}</div>
                  </div>

                  <div style={{ color: "#9CA3AF", flexShrink: 0 }}>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Expanded loans */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #F3F4F6" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#F9FAFB" }}>
                          {["Amount", "Interest", "Total Due", "Paid", "Remaining", "Due Date", "Purpose", "Status", "Actions"].map(h => (
                            <th key={h} style={{ padding: "9px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #F3F4F6" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {memberLoans.map(loan => (
                          <tr key={loan.id} style={{ borderBottom: "1px solid #F9FAFB" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500, color: "#111827" }}>K{Number(loan.amount).toLocaleString()}</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280" }}>{loan.interest_rate}%</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280" }}>K{Number(loan.total_due).toLocaleString()}</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280" }}>K{Number(loan.amount_paid).toLocaleString()}</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#DC2626" }}>K{(Number(loan.total_due) - Number(loan.amount_paid)).toLocaleString()}</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280" }}>{loan.due_date || "—"}</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280", maxWidth: 140 }}>{loan.purpose || "—"}</td>
                            <td style={{ padding: "12px 16px" }}>{statusBadge(loan.status)}</td>
                            <td style={{ padding: "12px 16px", display: "flex", gap: 6 }}>
                              {loan.status === "pending" && (
                                <button onClick={() => { setSelectedLoan(loan); setReviewForm({ interest_rate: "", due_date: "" }); setReviewError(""); }}
                                  style={{ padding: "4px 12px", background: "#EFF6FF", color: "#2563EB", border: "none", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                                  Review
                                </button>
                              )}
                              {loan.status === "active" && (
                                <>
                                  <button onClick={() => { setSelectedLoan(loan); setReviewError(""); }}
                                    style={{ padding: "4px 12px", background: "#EFF6FF", color: "#2563EB", border: "none", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                                    Details
                                  </button>
                                  <button onClick={() => navigate(`/treasurer/repayments?loan=${loan.id}`)}
                                    style={{ padding: "4px 12px", background: "#ECFDF5", color: "#059669", border: "none", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                                    Payment
                                  </button>
                                </>
                              )}
                              {(loan.status === "completed" || loan.status === "rejected") && (
                                <button onClick={() => setSelectedLoan(loan)}
                                  style={{ padding: "4px 12px", background: "#F3F4F6", color: "#6B7280", border: "none", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                                  View
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Clock, Check, X } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #E8EAED",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

export default function TreasurerRepayments() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [communityLoans, setCommunityLoans] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [community, setCommunity] = useState(null);
  const [form, setForm] = useState({ loan_id: "", amount: "", notes: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchRepayments = () => {
    axios.get(`${API}/repayments`, { headers }).then(res => setRepayments(res.data)).catch(() => {});
  };

  const fetchPendingRequests = () => {
    axios.get(`${API}/repayment-requests`, { headers }).then(res => setPendingRequests(res.data)).catch(() => {});
  };

  const fetchLoans = (myComm) => {
    axios.get(`${API}/loans`, { headers }).then(res => {
      const communityFiltered = res.data.filter(l => String(l.community_id) === String(myComm.id));
      setCommunityLoans(communityFiltered);
      setLoans(communityFiltered.filter(l => l.status === "active"));
    }).catch(() => {});
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });

    axios.get(`${API}/communities/my`, { headers }).then(commRes => {
      if (commRes.data.length === 0) return;
      const myComm = commRes.data[0];
      setCommunity(myComm);
      fetchLoans(myComm);
      const loanId = searchParams.get("loan");
      if (loanId) setForm(f => ({ ...f, loan_id: loanId }));
    }).catch(() => {});

    fetchRepayments();
    fetchPendingRequests();
  }, []);

  const handleSubmit = async () => {
    if (!form.loan_id || !form.amount) { setError("Loan and amount are required."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      await axios.post(`${API}/repayments`, {
        loan_id: parseInt(form.loan_id),
        amount: parseFloat(form.amount),
        notes: form.notes || null
      }, { headers });
      setSuccess("Repayment recorded successfully.");
      setForm({ loan_id: "", amount: "", notes: "" });
      fetchRepayments();
      if (community) fetchLoans(community);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to record repayment.");
    }
    setLoading(false);
  };

  const handleConfirm = async (id) => {
    setActionLoadingId(id);
    try {
      await axios.post(`${API}/repayment-requests/${id}/confirm`, {}, { headers });
      fetchPendingRequests();
      fetchRepayments();
      if (community) fetchLoans(community);
    } catch {}
    setActionLoadingId(null);
  };

  const handleReject = async (id) => {
    setActionLoadingId(id);
    try {
      await axios.post(`${API}/repayment-requests/${id}/reject`, {}, { headers });
      fetchPendingRequests();
    } catch {}
    setActionLoadingId(null);
  };

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  return (
    <Layout user={user} onLogout={logout} role="treasurer" activePath="/treasurer/repayments">

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Record Repayment</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>
          Log a member's loan repayment{community ? ` for ${community.name}` : ""}.
        </p>
      </div>

      {/* PENDING REQUESTS */}
      {pendingRequests.length > 0 && (
        <div style={{ ...card, padding: 0, overflow: "hidden", marginBottom: 24 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #E8EAED" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
              Pending Repayment Requests <span style={{ color: "#D97706" }}>({pendingRequests.length})</span>
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {pendingRequests.map(r => (
              <div key={r.id} style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid #F3F4F6" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={15} color="#D97706" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{r.user?.name ?? "Unknown"} — K{Number(r.amount).toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>{r.reference_note || "No reference note"}</div>
                </div>
                <button onClick={() => handleConfirm(r.id)} disabled={actionLoadingId === r.id}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", background: "#ECFDF5", color: "#059669", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  <Check size={13} /> Confirm
                </button>
                <button onClick={() => handleReject(r.id)} disabled={actionLoadingId === r.id}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  <X size={13} /> Reject
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ ...card, padding: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 20 }}>New Repayment</h3>
          {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 16 }}>{error}</div>}
          {success && <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 16 }}>{success}</div>}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Select Loan</label>
            <select value={form.loan_id} onChange={e => setForm({ ...form, loan_id: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none" }}>
              <option value="">Select active loan</option>
              {loans.map(l => {
                const remaining = Number(l.total_due) - Number(l.amount_paid);
                return (
                  <option key={l.id} value={l.id}>
                    {l.user?.name || "Unknown"} — K{Number(l.amount).toLocaleString()} (Remaining: K{remaining.toLocaleString()})
                  </option>
                );
              })}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Amount Paid (K)</label>
            <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 500"
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
              onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Notes (optional)</label>
            <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="e.g. Cash payment"
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
              onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", padding: "11px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {loading ? "Recording..." : "Record Repayment"}
          </button>
        </div>

        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E8EAED" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Recent Repayments</h3>
          </div>
          <div style={{ maxHeight: 400, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  {["Member", "Amount", "Date", "Notes"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #E8EAED" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {repayments.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: 32, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No repayments yet.</td></tr>
                ) : repayments.map(r => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #F3F4F6" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500, color: "#111827" }}>{r.loan?.user?.name ?? "—"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#059669" }}>K{Number(r.amount).toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#9CA3AF" }}>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B7280" }}>{r.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
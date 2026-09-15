import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #E8EAED",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  padding: "22px 24px",
};

export default function TreasurerContributions() {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [form, setForm] = useState({ user_id: "", amount: "", contribution_date: "", notes: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = () => {
    axios.get(`${API}/contributions`, { headers }).then(res => setContributions(res.data)).catch(() => {});
    axios.get(`${API}/contribution-requests`, { headers }).then(res => setPendingRequests(res.data)).catch(() => {});
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    axios.get(`${API}/communities/my`, { headers }).then(res => {
      if (res.data.length > 0) {
        const members = res.data[0].members?.filter(m => m.pivot?.role === "member") ?? [];
        setMembers(members);
      }
    }).catch(() => {});
    fetchAll();
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const handleConfirm = async (id) => {
    try {
      await axios.post(`${API}/contribution-requests/${id}/confirm`, {}, { headers });
      fetchAll();
    } catch (e) {
      alert("Failed to confirm.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`${API}/contribution-requests/${id}/reject`, {}, { headers });
      fetchAll();
    } catch (e) {
      alert("Failed to reject.");
    }
  };

  const handleSubmit = async () => {
    if (!form.user_id || !form.amount || !form.contribution_date) { setError("Member, amount, and date are required."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      await axios.post(`${API}/contributions`, form, { headers });
      setSuccess("Contribution recorded successfully.");
      setForm({ user_id: "", amount: "", contribution_date: "", notes: "" });
      fetchAll();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to record contribution.");
    }
    setLoading(false);
  };

  const totalContributions = contributions.reduce((sum, c) => sum + Number(c.amount), 0);

  return (
    <Layout user={user} onLogout={logout} role="treasurer" activePath="/treasurer/contributions">

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Contributions</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>Total pool: <span style={{ fontWeight: 600, color: "#059669" }}>K{totalContributions.toLocaleString()}</span></p>
      </div>

      {/* PENDING REQUESTS */}
      {pendingRequests.length > 0 && (
        <div style={{ ...card, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
            Pending Contribution Requests
            <span style={{ marginLeft: 8, background: "#FEF3C7", color: "#D97706", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{pendingRequests.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pendingRequests.map(req => (
              <div key={req.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: "#FAFAFA", borderRadius: 10, border: "1px solid #F3F4F6" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {req.user?.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{req.user?.name}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                    Sent <span style={{ fontWeight: 600, color: "#059669" }}>K{Number(req.amount).toLocaleString()}</span>
                    {req.reference_note && <> · Ref: {req.reference_note}</>}
                    {" · "}{new Date(req.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </div>
                </div>
                <button onClick={() => handleConfirm(req.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#ECFDF5", color: "#059669", border: "1px solid #BBF7D0", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  <CheckCircle size={13} /> Confirm
                </button>
                <button onClick={() => handleReject(req.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  <XCircle size={13} /> Reject
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* RECORD FORM */}
        <div style={{ ...card }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 20 }}>Record Contribution</h3>
          {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 14 }}>{error}</div>}
          {success && <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 14 }}>{success}</div>}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Member</label>
            <select value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none" }}>
              <option value="">Select member</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Amount (K)</label>
            <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 500"
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
              onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Date</label>
            <input type="date" value={form.contribution_date} onChange={e => setForm({ ...form, contribution_date: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
              onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Notes (optional)</label>
            <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="e.g. Monthly savings"
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
              onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
          </div>
          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", padding: "11px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {loading ? "Recording..." : "Record Contribution"}
          </button>
        </div>

        {/* CONTRIBUTIONS TABLE */}
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E8EAED" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>All Contributions</h3>
          </div>
          <div style={{ maxHeight: 460, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  {["Member", "Amount", "Date", "Notes"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #E8EAED" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contributions.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No contributions yet.</td></tr>
                ) : contributions.map(c => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #F3F4F6" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500, color: "#111827" }}>{c.user?.name ?? "—"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#059669" }}>K{Number(c.amount).toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#9CA3AF" }}>{c.contribution_date}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B7280" }}>{c.notes || "—"}</td>
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
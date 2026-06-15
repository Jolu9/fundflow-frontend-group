import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, X } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #E8EAED",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

export default function MemberContributions() {
  const [user, setUser] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [treasurer, setTreasurer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ amount: "", reference_note: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    axios.get(`${API}/member/contributions`, { headers }).then(res => setContributions(res.data)).catch(() => {});
    axios.get(`${API}/communities/my`, { headers }).then(res => {
      if (res.data.length > 0) {
        const t = res.data[0].members?.find(m => m.pivot?.role === "treasurer");
        if (t) setTreasurer(t);
      }
    }).catch(() => {});
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const handleSubmit = async () => {
    if (!form.amount) { setError("Amount is required."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      await axios.post(`${API}/contribution-requests`, form, { headers });
      setSuccess("Request sent! The treasurer will confirm once payment is received.");
      setForm({ amount: "", reference_note: "" });
      setTimeout(() => setShowModal(false), 2000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to submit request.");
    }
    setLoading(false);
  };

  const total = contributions.reduce((sum, c) => sum + Number(c.amount), 0);

  return (
    <Layout user={user} onLogout={logout} role="member" activePath="/member/contributions">

      {/* MODAL */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 460, boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Make a Contribution</h3>
              <button onClick={() => { setShowModal(false); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={18} /></button>
            </div>

            {/* TREASURER PHONE */}
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#059669", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Step 1 — Send Payment</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Smartphone size={18} color="#059669" />
                <div>
                  <div style={{ fontSize: 13, color: "#374151" }}>Send to <strong>{treasurer?.name ?? "your treasurer"}</strong> via Airtel/MTN Money</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginTop: 4 }}>
                    {treasurer?.phone ?? "Phone number not set"}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Step 2 — Submit Confirmation</div>

            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 14 }}>{error}</div>}
            {success && <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 14 }}>{success}</div>}

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Amount Sent (K)</label>
              <input type="number" placeholder="e.g. 500" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
                onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Transaction Reference <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span></label>
              <input type="text" placeholder="e.g. TXN123456" value={form.reference_note} onChange={e => setForm({ ...form, reference_note: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
                onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
            </div>
            <button onClick={handleSubmit} disabled={loading}
              style={{ width: "100%", padding: "11px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {loading ? "Submitting..." : "Notify Treasurer →"}
            </button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>My Contributions</h1>
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>
            {contributions.length} contribution{contributions.length !== 1 ? "s" : ""} recorded
            {contributions.length > 0 && <> · <span style={{ fontWeight: 600, color: "#059669" }}>K{total.toLocaleString()} total saved</span></>}
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          style={{ padding: "9px 18px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          + Make Contribution
        </button>
      </div>

      {contributions.length > 0 && (
        <div style={{ ...card, padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Total Saved</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#059669" }}>K{total.toLocaleString()}</div>
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>{contributions.length} payment{contributions.length !== 1 ? "s" : ""}</div>
        </div>
      )}

      <div style={{ ...card, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Date", "Amount", "Notes", "Recorded By"].map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #E8EAED" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contributions.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No contributions recorded yet.</td></tr>
            ) : contributions.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #F3F4F6" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280" }}>
                  {new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 700, color: "#059669" }}>K{Number(c.amount).toLocaleString()}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280" }}>{c.notes || "—"}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280" }}>{c.recorder?.name || "Treasurer"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
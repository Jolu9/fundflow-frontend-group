import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

export default function MemberApply() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ amount: "", purpose: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.purpose) { setError("All fields are required."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      await axios.post(`${API}/loan-applications`, form, { headers });
      setSuccess("Loan application submitted successfully. The treasurer will review it shortly.");
      setForm({ amount: "", purpose: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application.");
    }
    setLoading(false);
  };

  return (
    <Layout user={user} onLogout={logout} role="member" activePath="/member/apply">
      <div style={{ maxWidth: 600 }}>
        <div style={{ background: "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)", borderRadius: 16, padding: "32px 36px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 600 140" preserveAspectRatio="xMidYMid slice">
            <defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/></pattern></defs>
            <rect width="600" height="140" fill="url(#g)"/>
            <circle cx="550" cy="20" r="100" fill="rgba(102,126,234,0.1)"/>
          </svg>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Member Portal</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Apply for a Loan</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Fill in the form below and the treasurer will review your application.</p>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 14, padding: 32, border: "1px solid #EAECF0" }}>
          {error && <div style={{ background: "#FFF0F0", border: "1px solid #FFCDD2", color: "#C62828", padding: "12px 16px", borderRadius: 8, fontSize: 13, marginBottom: 20 }}>{error}</div>}
          {success && <div style={{ background: "#F0FFF4", border: "1px solid #C6F6D5", color: "#276749", padding: "12px 16px", borderRadius: 8, fontSize: 13, marginBottom: 20 }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Loan Amount (K)</label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                required
                style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Purpose of Loan</label>
              <textarea
                placeholder="Briefly describe why you need this loan..."
                value={form.purpose}
                onChange={e => setForm({ ...form, purpose: e.target.value })}
                required
                rows={4}
                style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box", resize: "vertical" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: 13, background: "linear-gradient(135deg, #667EEA, #764BA2)", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif", boxShadow: "0 4px 14px rgba(102,126,234,0.4)" }}
            >
              {loading ? "Submitting..." : "Submit Application →"}
            </button>
          </form>

          <div style={{ marginTop: 24, background: "#F8F9FF", borderRadius: 10, padding: "14px 16px", fontSize: 12, color: "#667EEA", lineHeight: 1.7, border: "1px solid rgba(102,126,234,0.15)" }}>
            <strong style={{ display: "block", color: "#0F0C29", marginBottom: 4 }}>What happens next?</strong>
            Your application will be reviewed by the treasurer. Once approved, the loan will appear in your My Loans section with the amount, interest rate, and due date.
          </div>
        </div>
      </div>
    </Layout>
  );
}
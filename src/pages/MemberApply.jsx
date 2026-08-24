import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #E8EAED",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

export default function MemberApply() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ amount: "", purpose: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingLoan, setExistingLoan] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    axios.get(`${API}/member/loans`, { headers }).then(res => {
      const active = res.data.find(l => ["pending", "active", "overdue"].includes(l.status));
      if (active) setExistingLoan(active);
    }).catch(() => {});
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const handleSubmit = async () => {
    if (!form.amount || !form.purpose) { setError("All fields are required."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      await axios.post(`${API}/loan-applications`, form, { headers });
      setSuccess("Application submitted. The treasurer will review it shortly.");
      setForm({ amount: "", purpose: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application.");
    }
    setLoading(false);
  };

  const statusColor = { pending: "#D97706", active: "#2563EB", overdue: "#DC2626" };
  const statusLabel = { pending: "Pending approval", active: "Active", overdue: "Overdue" };

  return (
    <Layout user={user} onLogout={logout} role="member" activePath="/member/apply">

      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Apply for a Loan</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>Fill in the form below and the treasurer will review your application.</p>
      </div>

      <div style={{ maxWidth: 560 }}>

        {existingLoan ? (
          <div style={{ ...card, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: statusColor[existingLoan.status] ?? "#9CA3AF", flexShrink: 0 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>You have an outstanding loan</div>
            </div>
            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, marginBottom: 20 }}>
              You cannot apply for a new loan until your current loan is fully repaid. Your loan of{" "}
              <span style={{ fontWeight: 600, color: "#111827" }}>K{Number(existingLoan.amount).toLocaleString()}</span> is currently{" "}
              <span style={{ fontWeight: 600, color: statusColor[existingLoan.status] }}>{statusLabel[existingLoan.status]}</span>.
            </p>
            <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#374151", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#9CA3AF" }}>Amount</span>
                <span style={{ fontWeight: 600 }}>K{Number(existingLoan.amount).toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#9CA3AF" }}>Paid so far</span>
                <span style={{ fontWeight: 600, color: "#059669" }}>K{Number(existingLoan.amount_paid).toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Remaining</span>
                <span style={{ fontWeight: 600, color: "#DC2626" }}>K{(Number(existingLoan.total_due) - Number(existingLoan.amount_paid)).toLocaleString()}</span>
              </div>
            </div>
            <button onClick={() => navigate("/member/loans")}
              style={{ width: "100%", padding: "10px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              View my current loan →
            </button>
          </div>
        ) : (
          <>
            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "11px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
            {success && <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", padding: "11px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{success}</div>}

            <div style={{ ...card, padding: 28, marginBottom: 16 }}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Loan Amount (K)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
                  onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"}
                />
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Purpose of Loan</label>
                <textarea
                  placeholder="Briefly describe why you need this loan..."
                  value={form.purpose}
                  onChange={e => setForm({ ...form, purpose: e.target.value })}
                  rows={4}
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "vertical" }}
                  onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
                  onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: "100%", padding: "11px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {loading ? "Submitting..." : "Submit Application →"}
              </button>
            </div>

            <div style={{ background: "#F8FAFF", borderRadius: 10, padding: "14px 18px", fontSize: 12, color: "#1D4ED8", lineHeight: 1.7, border: "1px solid #E0EAFF" }}>
              <strong style={{ display: "block", marginBottom: 3, color: "#1E3A8A" }}>What happens next?</strong>
              Your application will be reviewed by the treasurer. Once approved, the loan will appear in My Loans with the interest rate and due date.
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

export default function MemberLoans() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    axios.get(`${API}/member/loans`, { headers }).then(res => setLoans(res.data)).catch(() => {});
  }, []);

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
    <Layout user={user} onLogout={logout} role="member" activePath="/member/loans">
      <div style={{ background: "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)", borderRadius: 16, padding: "32px 36px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 800 140" preserveAspectRatio="xMidYMid slice">
          <defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/></pattern></defs>
          <rect width="800" height="140" fill="url(#g)"/>
          <circle cx="700" cy="20" r="120" fill="rgba(102,126,234,0.1)"/>
        </svg>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Member Portal</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>My Loans</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{loans.length} loan{loans.length !== 1 ? "s" : ""} on your account</p>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EAECF0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Amount", "Interest", "Total Due", "Paid", "Remaining", "Due Date", "Purpose", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#667085", borderBottom: "1px solid #EAECF0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
                No loans yet. <span onClick={() => navigate("/member/apply")} style={{ color: "#667EEA", cursor: "pointer", fontWeight: 600 }}>Apply for one →</span>
              </td></tr>
            ) : loans.map(loan => (
              <tr key={loan.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#0F0C29" }}>K{Number(loan.amount).toLocaleString()}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>{loan.interest_rate}%</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>K{Number(loan.total_due).toLocaleString()}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>K{Number(loan.amount_paid).toLocaleString()}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#DC2626" }}>K{(Number(loan.total_due) - Number(loan.amount_paid)).toLocaleString()}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>{loan.due_date || "—"}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>{loan.purpose || "—"}</td>
                <td style={{ padding: "14px 16px" }}>{statusBadge(loan.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
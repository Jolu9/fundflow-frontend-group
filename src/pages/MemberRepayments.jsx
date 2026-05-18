import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

export default function MemberRepayments() {
  const [user, setUser] = useState(null);
  const [repayments, setRepayments] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    axios.get(`${API}/member/repayments`, { headers }).then(res => setRepayments(res.data)).catch(() => {});
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  return (
    <Layout user={user} onLogout={logout} role="member" activePath="/member/repayments">
      <div style={{ background: "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)", borderRadius: 16, padding: "32px 36px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 800 140" preserveAspectRatio="xMidYMid slice">
          <defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/></pattern></defs>
          <rect width="800" height="140" fill="url(#g)"/>
          <circle cx="700" cy="20" r="120" fill="rgba(102,126,234,0.1)"/>
        </svg>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Member Portal</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Repayment History</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>All your recorded repayments</p>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EAECF0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Date", "Loan Amount", "Amount Paid", "Recorded By"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#667085", borderBottom: "1px solid #EAECF0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {repayments.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>No repayments recorded yet.</td></tr>
            ) : repayments.map(r => (
              <tr key={r.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>{new Date(r.created_at).toLocaleDateString()}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#0F0C29", fontWeight: 600 }}>K{Number(r.loan?.amount).toLocaleString()}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#16A34A" }}>K{Number(r.amount).toLocaleString()}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>{r.recorded_by?.name || "Treasurer"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
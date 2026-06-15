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

  const total = repayments.reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <Layout user={user} onLogout={logout} role="member" activePath="/member/repayments">

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Repayment History</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>
          {repayments.length} repayment{repayments.length !== 1 ? "s" : ""} recorded
          {repayments.length > 0 && <> · <span style={{ fontWeight: 600, color: "#059669" }}>K{total.toLocaleString()} total paid</span></>}
        </p>
      </div>

      {repayments.length > 0 && (
        <div style={{ ...card, padding: "20px 24px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Total Repaid</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#059669" }}>K{total.toLocaleString()}</div>
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>{repayments.length} payment{repayments.length !== 1 ? "s" : ""}</div>
        </div>
      )}

      <div style={{ ...card, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Date", "Loan Amount", "Amount Paid", "Recorded By"].map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #E8EAED" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {repayments.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No repayments recorded yet.</td></tr>
            ) : repayments.map(r => (
              <tr key={r.id} style={{ borderBottom: "1px solid #F3F4F6" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280" }}>
                  {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: "#111827" }}>K{Number(r.loan?.amount).toLocaleString()}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 700, color: "#059669" }}>K{Number(r.amount).toLocaleString()}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280" }}>{r.recorded_by?.name || "Treasurer"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
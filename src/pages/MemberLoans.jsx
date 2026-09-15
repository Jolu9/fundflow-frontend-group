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
      active: { background: "#ECFDF5", color: "#059669" },
      overdue: { background: "#FEF2F2", color: "#DC2626" },
      completed: { background: "#EFF6FF", color: "#2563EB" },
      pending: { background: "#FEF3C7", color: "#D97706" },
      rejected: { background: "#F3F4F6", color: "#6B7280" },
    };
    return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, ...(styles[status] || {}) }}>{status}</span>;
  };

  return (
    <Layout user={user} onLogout={logout} role="member" activePath="/member/loans">

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>My Loans</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>{loans.length} loan{loans.length !== 1 ? "s" : ""} on your account</p>
      </div>

      <div style={{ ...card, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Amount", "Interest", "Total Due", "Paid", "Remaining", "Due Date", "Purpose", "Status"].map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #E8EAED" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
                No loans yet. <span onClick={() => navigate("/member/apply")} style={{ color: "#2563EB", cursor: "pointer", fontWeight: 600 }}>Apply for one →</span>
              </td></tr>
            ) : loans.map(loan => (
              <tr key={loan.id} style={{ borderBottom: "1px solid #F3F4F6" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: "#111827" }}>K{Number(loan.amount).toLocaleString()}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280" }}>{loan.interest_rate}%</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280" }}>K{Number(loan.total_due).toLocaleString()}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280" }}>K{Number(loan.amount_paid).toLocaleString()}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: loan.status === "rejected" ? "#9CA3AF" : "#DC2626" }}>
  {loan.status === "rejected" ? "—" : `K${(Number(loan.total_due) - Number(loan.amount_paid)).toLocaleString()}`}
</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280" }}>{loan.due_date || "—"}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280", maxWidth: 160 }}>{loan.purpose || "—"}</td>
                <td style={{ padding: "13px 16px" }}>
  {statusBadge(loan.status)}
  {loan.review_note && (
    <div style={{ fontSize: 11, color: "#DC2626", marginTop: 4, maxWidth: 180 }}>{loan.review_note}</div>
  )}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
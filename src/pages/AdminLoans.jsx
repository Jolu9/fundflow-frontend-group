import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8000/api";

const Navbar = ({ user, onLogout }) => (
  <div style={{ background: "#0D1B5E", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
    <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Fund<span style={{ color: "#4FC3F7" }}>Flow</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{user?.name}</span>
      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#4FC3F7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#0D1B5E" }}>{user?.name?.[0] ?? "A"}</div>
      <button onClick={onLogout} style={{ padding: "7px 16px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, fontSize: 13, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Logout</button>
    </div>
  </div>
);

const Sidebar = ({ navigate, active }) => (
  <div style={{ width: 220, background: "#fff", minHeight: "calc(100vh - 60px)", borderRight: "1px solid #eee", padding: "24px 0" }}>
    {[
      { label: "Dashboard", icon: "🏠", path: "/admin" },
      { label: "Users", icon: "👤", path: "/admin/users" },
      { label: "Loans", icon: "💰", path: "/admin/loans" },
      { label: "Repayments", icon: "📋", path: "/admin/repayments" },
      { label: "Reports", icon: "📊", path: "/admin/reports" },
    ].map(item => (
      <div key={item.label} onClick={() => navigate(item.path)}
        style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontSize: 14, fontWeight: item.label === active ? 600 : 400, color: item.label === active ? "#0D1B5E" : "#666", background: item.label === active ? "#F0F4FF" : "transparent", borderLeft: item.label === active ? "3px solid #0D1B5E" : "3px solid transparent" }}>
        <span>{item.icon}</span> {item.label}
      </div>
    ))}
  </div>
);

export default function AdminLoans() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    axios.get(`${API}/loans`, { headers }).then(res => setLoans(res.data)).catch(() => {});
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const statusBadge = (status) => {
    const styles = {
      active: { background: "#E8F5E9", color: "#388E3C" },
      overdue: { background: "#FFEBEE", color: "#C62828" },
      completed: { background: "#E3F2FD", color: "#1565C0" },
      pending: { background: "#FFF8E1", color: "#F57F17" },
    };
    const s = styles[status] || {};
    return <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, ...s }}>{status}</span>;
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", background: "#F4F6FB" }}>
        <Navbar user={user} onLogout={logout} />
        <div style={{ display: "flex" }}>
          <Sidebar navigate={navigate} active="Loans" />
          <div style={{ flex: 1, padding: 32 }}>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0D1B5E", marginBottom: 4 }}>Loans</h1>
              <p style={{ fontSize: 13, color: "#999" }}>{loans.length} total loans — view only</p>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8F9FF" }}>
                    {["Member", "Amount", "Interest", "Total Due", "Paid", "Due Date", "Purpose", "Status"].map(h => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#666", borderBottom: "1px solid #eee" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loans.length === 0 ? (
                    <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#999", fontSize: 14 }}>No loans in the system yet.</td></tr>
                  ) : loans.map(loan => (
                    <tr key={loan.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#0D1B5E" }}>{loan.user?.name ?? "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#555" }}>K{Number(loan.amount).toLocaleString()}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#555" }}>{loan.interest_rate}%</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#555" }}>K{Number(loan.total_due).toLocaleString()}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#555" }}>K{Number(loan.amount_paid).toLocaleString()}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#555" }}>{loan.due_date}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#555" }}>{loan.purpose || "—"}</td>
                      <td style={{ padding: "14px 16px" }}>{statusBadge(loan.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, AlertTriangle, CheckCircle, Wallet } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

export default function MemberDashboard() {
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

  const totalDue = loans.reduce((sum, l) => sum + Number(l.total_due), 0);
  const totalPaid = loans.reduce((sum, l) => sum + Number(l.amount_paid), 0);
  const activeLoans = loans.filter(l => l.status === "active").length;
  const overdueLoans = loans.filter(l => l.status === "overdue").length;

  const cards = [
    { label: "Active Loans", value: activeLoans, icon: CreditCard, color: "#ECFDF5", accent: "#059669" },
    { label: "Overdue Loans", value: overdueLoans, icon: AlertTriangle, color: "#FFF7ED", accent: "#EA580C" },
    { label: "Total Paid", value: `K${totalPaid.toLocaleString()}`, icon: CheckCircle, color: "#EEF2FF", accent: "#4F46E5" },
    { label: "Balance Remaining", value: `K${(totalDue - totalPaid).toLocaleString()}`, icon: Wallet, color: "#F5F3FF", accent: "#7C3AED" },
  ];

  const statusBadge = (status) => {
    const styles = {
      active: { background: "#ECFDF5", color: "#059669" },
      overdue: { background: "#FFF7ED", color: "#EA580C" },
      completed: { background: "#EEF2FF", color: "#4F46E5" },
      pending: { background: "#FEFCE8", color: "#CA8A04" },
    };
    const s = styles[status] || {};
    return <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, ...s }}>{status}</span>;
  };

  return (
    <Layout user={user} onLogout={logout} role="member" activePath="/member">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0D1B5E", marginBottom: 4 }}>My Dashboard</h1>
        <p style={{ fontSize: 13, color: "#667085" }}>Welcome back, {user?.name}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #EAECF0" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: card.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon size={20} color={card.accent} strokeWidth={2} />
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#0D1B5E", marginBottom: 4 }}>{card.value}</div>
              <div style={{ fontSize: 13, color: "#667085" }}>{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Active Loan Card */}
      {(() => {
        const activeLoan = loans.find(l => l.status === "active");
        if (!activeLoan) return null;
        const remaining = activeLoan.total_due - activeLoan.amount_paid;
        const progress = (activeLoan.amount_paid / activeLoan.total_due) * 100;
        
        return (
          <div style={{ background: "linear-gradient(135deg, #667EEA, #764BA2)", borderRadius: 16, padding: 28, marginBottom: 28, color: "white", position: "relative", overflow: "hidden" }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
              <circle cx="600" cy="50" r="150" fill="rgba(255,255,255,0.05)"/>
              <circle cx="700" cy="150" r="100" fill="rgba(255,255,255,0.03)"/>
            </svg>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8, marginBottom: 8 }}>📌 Current Active Loan</div>
              <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>K{activeLoan.amount?.toLocaleString()}</div>
              <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 20 }}>
                Interest: {activeLoan.interest_rate}% | Due: {activeLoan.due_date}
              </div>
              <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: 4, marginBottom: 16 }}>
                <div style={{ width: `${progress}%`, background: "white", height: 8, borderRadius: 10 }}></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>Paid</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>K{activeLoan.amount_paid?.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>Remaining</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>K{remaining.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0D1B5E", marginBottom: 16 }}>My loans</h2>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #EAECF0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Amount", "Interest", "Total Due", "Paid", "Remaining", "Due Date", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#667085", borderBottom: "1px solid #EAECF0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#667085", fontSize: 14 }}>No loans yet. Apply for one from the sidebar.</td></tr>
            ) : loans.map(loan => (
              <tr key={loan.id} style={{ borderBottom: "1px solid #F2F4F7" }}>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#0D1B5E" }}>K{Number(loan.amount).toLocaleString()}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>{loan.interest_rate}%</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>K{Number(loan.total_due).toLocaleString()}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>K{Number(loan.amount_paid).toLocaleString()}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#EA580C" }}>K{(Number(loan.total_due) - Number(loan.amount_paid)).toLocaleString()}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#667085" }}>{loan.due_date}</td>
                <td style={{ padding: "14px 16px" }}>{statusBadge(loan.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
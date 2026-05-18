import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CreditCard, AlertTriangle, TrendingUp, PlusCircle, ClipboardList } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

export default function TreasurerDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ 
    members: 0, 
    activeLoans: 0, 
    overdueLoans: 0, 
    totalDisbursed: 0,
    totalRepaid: 0,
    pendingLoans: 0
  });
  const [recentLoans, setRecentLoans] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    
    axios.get(`${API}/me`, { headers })
      .then(res => setUser(res.data))
      .catch(() => { localStorage.clear(); navigate("/login"); });
    
    // Get all loans
    axios.get(`${API}/loans`, { headers })
      .then(res => {
        const loans = res.data;
        setRecentLoans(loans.slice(0, 5));
        
        // Calculate stats
        const activeLoans = loans.filter(l => l.status === "active").length;
        const overdueLoans = loans.filter(l => l.status === "overdue").length;
        const pendingLoans = loans.filter(l => l.status === "pending").length;
        const totalDisbursed = loans.reduce((sum, l) => sum + Number(l.amount), 0);
        const totalRepaid = loans.reduce((sum, l) => sum + Number(l.amount_paid), 0);
        
        setStats({ 
          members: 0, 
          activeLoans, 
          overdueLoans, 
          totalDisbursed,
          totalRepaid,
          pendingLoans
        });
      })
      .catch(() => {});
    
    // Get member count
    axios.get(`${API}/users`, { headers })
      .then(res => {
        const members = res.data.filter(u => u.role === "member");
        setStats(prev => ({ ...prev, members: members.length }));
      })
      .catch(() => {});
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { 
      localStorage.clear(); 
      navigate("/login"); 
    });
  };

  const cards = [
    { label: "Total Members", value: stats.members, icon: Users, color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Active Loans", value: stats.activeLoans, icon: CreditCard, color: "#10B981", bg: "#ECFDF5" },
    { label: "Pending Approval", value: stats.pendingLoans, icon: AlertTriangle, color: "#F59E0B", bg: "#FEF3C7" },
    { label: "Overdue Loans", value: stats.overdueLoans, icon: AlertTriangle, color: "#EF4444", bg: "#FEE2E2" },
    { label: "Total Disbursed", value: `K${stats.totalDisbursed.toLocaleString()}`, icon: TrendingUp, color: "#8B5CF6", bg: "#F3E8FF" },
    { label: "Total Repaid", value: `K${stats.totalRepaid.toLocaleString()}`, icon: TrendingUp, color: "#059669", bg: "#D1FAE5" },
  ];

  const actions = [
    { label: "Issue Loan", desc: "Create new loan for a member", path: "/treasurer/loans", icon: PlusCircle, color: "#3B82F6" },
    { label: "Record Repayment", desc: "Log a member's payment", path: "/treasurer/repayments", icon: ClipboardList, color: "#10B981" },
    { label: "View Members", desc: "See all registered members", path: "/treasurer/users", icon: Users, color: "#8B5CF6" },
  ];

  const statusBadge = (status) => {
    const styles = {
      active: { background: "#D1FAE5", color: "#065F46" },
      overdue: { background: "#FEE2E2", color: "#991B1B" },
      completed: { background: "#DBEAFE", color: "#1E40AF" },
      pending: { background: "#FEF3C7", color: "#92400E" },
    };
    const s = styles[status] || styles.pending;
    return <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, ...s }}>{status}</span>;
  };

  return (
    <Layout user={user} onLogout={logout} role="treasurer" activePath="/treasurer">
      {/* Welcome Banner */}
      <div style={{ background: "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)", borderRadius: 16, padding: "28px 32px", marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Treasurer Dashboard</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Welcome back, {user?.name} 👋</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Manage loans, approve applications, and record repayments.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #EAECF0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} color={card.color} />
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0F0C29", marginBottom: 4 }}>{card.value}</div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F0C29", marginBottom: 16 }}>Quick Actions</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {actions.map(a => {
          const Icon = a.icon;
          return (
            <div 
              key={a.label} 
              onClick={() => navigate(a.path)}
              style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #EAECF0", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${a.color}10`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon size={22} color={a.color} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0F0C29", marginBottom: 4 }}>{a.label}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>{a.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Loans */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #EAECF0", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #EAECF0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F0C29" }}>Recent Loan Applications</h2>
          <button onClick={() => navigate("/treasurer/loans")} style={{ background: "none", border: "none", color: "#3B82F6", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>View all →</button>
        </div>
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#667085" }}>Member</th>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#667085" }}>Amount</th>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#667085" }}>Applied</th>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#667085" }}>Status</th>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#667085" }}></th>
              </tr>
            </thead>
            <tbody>
              {recentLoans.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#9CA3AF" }}>No loans yet</td></tr>
              ) : (
                recentLoans.map(loan => (
                  <tr key={loan.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "#0F0C29" }}>{loan.user?.name || "—"}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#667085" }}>K{Number(loan.amount).toLocaleString()}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#9CA3AF" }}>{new Date(loan.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: "14px 20px" }}>{statusBadge(loan.status)}</td>
                    <td style={{ padding: "14px 20px" }}>
                      {loan.status === "pending" && (
                        <button onClick={() => navigate("/treasurer/loans")} style={{ padding: "5px 12px", background: "#3B82F610", color: "#3B82F6", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Review</button>
                      )}
                      {loan.status === "active" && (
                        <button onClick={() => navigate(`/treasurer/repayments?loan=${loan.id}`)} style={{ padding: "5px 12px", background: "#10B98110", color: "#10B981", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Record Payment</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
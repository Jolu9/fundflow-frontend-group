import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CreditCard, AlertTriangle, TrendingUp } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ members: 0, activeLoans: 0, overdueLoans: 0, totalDisbursed: 0 });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    axios.get(`${API}/stats`, { headers }).then(res => setStats(res.data)).catch(() => {});
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const cards = [
    { label: "Total Users", value: stats.members, icon: Users, gradient: "linear-gradient(135deg, #667EEA, #764BA2)", shadow: "rgba(102,126,234,0.35)" },
    { label: "Active Loans", value: stats.activeLoans, icon: CreditCard, gradient: "linear-gradient(135deg, #11998e, #38ef7d)", shadow: "rgba(17,153,142,0.35)" },
    { label: "Overdue Loans", value: stats.overdueLoans, icon: AlertTriangle, gradient: "linear-gradient(135deg, #f7971e, #ffd200)", shadow: "rgba(247,151,30,0.35)" },
    { label: "Total Disbursed", value: `K${Number(stats.totalDisbursed).toLocaleString()}`, icon: TrendingUp, gradient: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)", shadow: "rgba(131,58,180,0.35)" },
  ];

  const actions = [
    { label: "Manage Users", desc: "Create and manage system accounts", path: "/admin/users", icon: Users, gradient: "linear-gradient(135deg, #667EEA, #764BA2)" },
    { label: "View Loans", desc: "Monitor all loans in the system", path: "/admin/loans", icon: CreditCard, gradient: "linear-gradient(135deg, #11998e, #38ef7d)" },
    { label: "Reports", desc: "Generate financial summaries", path: "/admin/reports", icon: TrendingUp, gradient: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" },
  ];

  return (
    <Layout user={user} onLogout={logout} role="admin" activePath="/admin">
      {/* HERO BANNER */}
      <div style={{ background: "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)", borderRadius: 16, padding: "32px 36px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 800 160" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="dgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="800" height="160" fill="url(#dgrid)"/>
          <circle cx="700" cy="20" r="120" fill="rgba(102,126,234,0.1)"/>
          <circle cx="750" cy="140" r="80" fill="rgba(118,75,162,0.1)"/>
        </svg>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Admin Panel</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Welcome back, {user?.name} 👋</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Here's what's happening with FundFlow today.</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #EAECF0", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: card.gradient }}></div>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: card.gradient, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: `0 4px 14px ${card.shadow}` }}>
                <Icon size={21} color="#fff" strokeWidth={2} />
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#0F0C29", marginBottom: 4 }}>{card.value}</div>
              <div style={{ fontSize: 13, color: "#9CA3AF" }}>{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* QUICK ACTIONS */}
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F0C29", marginBottom: 16 }}>Quick actions</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {actions.map(a => {
          const Icon = a.icon;
          return (
            <div key={a.label} onClick={() => navigate(a.path)}
              style={{ background: "#fff", borderRadius: 14, padding: 24, cursor: "pointer", border: "1px solid #EAECF0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(102,126,234,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: a.gradient }}></div>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: a.gradient, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: "0 4px 14px rgba(102,126,234,0.3)" }}>
                <Icon size={21} color="#fff" strokeWidth={2} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0F0C29", marginBottom: 4 }}>{a.label}</div>
              <div style={{ fontSize: 13, color: "#9CA3AF" }}>{a.desc}</div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
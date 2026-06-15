import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CreditCard, AlertTriangle, TrendingUp, PlusCircle, Globe, Clock } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [loans, setLoans] = useState([]);
  const [pendingRequests, setPendingRequests] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    axios.get(`${API}/communities`, { headers }).then(res => setCommunities(res.data)).catch(() => {});
    axios.get(`${API}/loans`, { headers }).then(res => setLoans(res.data)).catch(() => {});
    axios.get(`${API}/join-requests`, { headers }).then(res => setPendingRequests(res.data.length)).catch(() => {});
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const globalStats = [
    { label: "Total Communities", value: communities.length, icon: Globe, color: "#2563EB" },
    { label: "Pending Join Requests", value: pendingRequests, icon: Clock, color: "#D97706" },
  ];

  return (
    <Layout user={user} onLogout={logout} role="admin" activePath="/admin">

      {/* WELCOME */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
          Welcome back, {user?.name}
        </h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>Platform overview across all communities.</p>
      </div>

      {/* GLOBAL STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 32 }}>
        {globalStats.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", border: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#9CA3AF", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>{card.label}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{card.value}</div>
              <Icon size={15} color={card.color} strokeWidth={2} />
            </div>
          );
        })}
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Quick Actions</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Create Community", desc: "Set up a new Chilimba group", path: "/admin/communities", icon: PlusCircle, color: "#2563EB" },
          { label: "Add User", desc: "Register a new platform user", path: "/admin/users", icon: Users, color: "#7C3AED" },
        ].map(a => {
          const Icon = a.icon;
          return (
            <div key={a.label} onClick={() => navigate(a.path)}
              style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", cursor: "pointer", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 16, transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#BFDBFE"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#E5E7EB"}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "#F7F8FA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={18} color={a.color} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{a.label}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{a.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* COMMUNITIES BREAKDOWN */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Communities</h2>
      </div>

      {communities.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E5E7EB", padding: "48px 24px", textAlign: "center" }}>
          <Globe size={28} color="#D1D5DB" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>No communities yet. Create one to get started.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {communities.map(c => {
            const treasurer = c.members?.find(m => m.pivot?.role === "treasurer");
            const memberCount = c.members?.filter(m => m.pivot?.role === "member").length ?? 0;
            const communityLoans = loans.filter(l => l.community_id === c.id);
            const activeLoans = communityLoans.filter(l => l.status === "active").length;
            const overdueLoans = communityLoans.filter(l => l.status === "overdue").length;
            const totalDisbursed = communityLoans.reduce((sum, l) => sum + Number(l.amount), 0);

            return (
              <div key={c.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid #E5E7EB", padding: "20px 24px" }}>
                {/* Community header */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                    Treasurer: <span style={{ color: "#374151", fontWeight: 500 }}>{treasurer?.name ?? "—"}</span>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  {[
                    { label: "Members", value: memberCount, icon: Users, color: "#2563EB" },
                    { label: "Active Loans", value: activeLoans, icon: CreditCard, color: "#059669" },
                    { label: "Overdue", value: overdueLoans, icon: AlertTriangle, color: "#DC2626" },
                    { label: "Disbursed", value: `K${totalDisbursed.toLocaleString()}`, icon: TrendingUp, color: "#7C3AED" },
                  ].map(stat => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} style={{ textAlign: "center", padding: "12px 8px", background: "#F9FAFB", borderRadius: 8 }}>
                        <Icon size={13} color={stat.color} style={{ marginBottom: 6 }} />
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{stat.value}</div>
                        <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
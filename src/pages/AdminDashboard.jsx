import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UsersRound, ChevronRight } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #E8EAED",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  padding: "22px 24px",
};

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ users: 0, groups: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    
    axios.get(`${API}/me`, { headers })
      .then(res => setUser(res.data))
      .catch(() => { localStorage.clear(); navigate("/login"); });

    Promise.all([
      axios.get(`${API}/users`, { headers }),
      axios.get(`${API}/communities`, { headers }),
    ]).then(([usersRes, communitiesRes]) => {
      setStats({
        users: usersRes.data.length,
        groups: communitiesRes.data.length,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers })
      .finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const statCards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "#2563EB", bg: "#EFF6FF" },
    { label: "Total Groups", value: stats.groups, icon: UsersRound, color: "#059669", bg: "#ECFDF5" },
  ];

  return (
    <Layout user={user} onLogout={logout} role="admin" activePath="/admin">

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
          Welcome, {user?.name}
        </h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>
          Manage users and groups across the platform
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#9CA3AF", padding: 60 }}>Loading...</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {statCards.map((s) => (
              <div key={s.label} style={{ ...card }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <s.icon size={20} color={s.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#111827", letterSpacing: "-0.5px" }}>
                      {s.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "Manage Users", icon: Users, path: "/admin/users", color: "#2563EB", bg: "#EFF6FF" },
              { label: "Manage Groups", icon: UsersRound, path: "/admin/groups", color: "#059669", bg: "#ECFDF5" },
            ].map((item) => (
              <div 
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{ 
                  ...card, 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 24px",
                  transition: "box-shadow 0.15s, transform 0.1s"
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <item.icon size={22} color={item.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>View and manage all</div>
                  </div>
                </div>
                <ChevronRight size={20} color="#9CA3AF" />
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
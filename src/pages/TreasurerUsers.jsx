import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

export default function TreasurerUsers() {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    axios.get(`${API}/users`, { headers })
      .then(res => {
        const membersList = res.data.filter(u => u.role === "member");
        setMembers(membersList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  return (
    <Layout user={user} onLogout={logout} role="treasurer" activePath="/treasurer/users">
      <div style={{ background: "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)", borderRadius: 16, padding: "32px 36px", marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Members</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{members.length} registered member{members.length !== 1 ? "s" : ""}</p>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EAECF0", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9CA3AF" }}>Loading...</div>
        ) : members.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9CA3AF" }}>No members found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#667085" }}>#</th>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#667085" }}>Name</th>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#667085" }}>Email</th>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#667085" }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: "1px solid #F3F4F6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#9CA3AF" }}>{i + 1}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #667EEA, #764BA2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                        {m.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0F0C29" }}>{m.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#667085" }}>{m.email}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#9CA3AF" }}>{new Date(m.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
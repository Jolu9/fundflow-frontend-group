import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, Trash2 } from "lucide-react";
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

export default function AdminUsers() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get(`${API}/users`, { headers }).then(res => {
      setUsers(res.data);
      setFilteredUsers(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = users.filter(u => 
      u.name.toLowerCase().includes(term.toLowerCase()) ||
      u.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await axios.delete(`${API}/users/${id}`, { headers });
      setUsers(users.filter(u => u.id !== id));
      setFilteredUsers(filteredUsers.filter(u => u.id !== id));
    } catch (e) {
      alert("Failed to delete user.");
    }
    setDeleting(null);
  };

  const getRoleColor = (role) => {
    const colors = { admin: "#DC2626", treasurer: "#D97706", member: "#2563EB" };
    return colors[role] || "#6B7280";
  };

  return (
    <Layout user={user} onLogout={logout} role="admin" activePath="/admin/users">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Users</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>All registered users ({filteredUsers.length})</p>
      </div>

      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#F9FAFB", borderRadius: 8, padding: "0 12px", border: "1px solid #E5E7EB" }}>
            <Search size={16} color="#9CA3AF" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm} 
              onChange={e => handleSearch(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: "none", background: "transparent", fontSize: 13, outline: "none", fontFamily: "inherit" }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#9CA3AF", padding: 40 }}>Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div style={{ ...card, textAlign: "center", padding: 60 }}>
          <Users size={32} color="#D1D5DB" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 14, color: "#6B7280" }}>No users found.</div>
        </div>
      ) : (
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #E8EAED" }}>User</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #E8EAED" }}>Email</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #E8EAED" }}>Role</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #E8EAED" }}>Group</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #E8EAED" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => {
                const group = u.communities?.[0]?.name || "—";
                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#6B7280" }}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{u.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B7280" }}>{u.email}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ 
                        display: "inline-block", 
                        padding: "2px 10px", 
                        borderRadius: 20, 
                        fontSize: 11, 
                        fontWeight: 600, 
                        background: `${getRoleColor(u.role)}15`, 
                        color: getRoleColor(u.role) 
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B7280" }}>{group}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <button 
                        onClick={() => handleDelete(u.id, u.name)}
                        disabled={deleting === u.id}
                        style={{ 
                          padding: "5px 12px", 
                          background: "#FEF2F2", 
                          color: "#DC2626", 
                          border: "1px solid #FECACA", 
                          borderRadius: 6, 
                          fontSize: 11, 
                          fontWeight: 600, 
                          cursor: "pointer",
                          fontFamily: "inherit",
                          opacity: deleting === u.id ? 0.5 : 1
                        }}
                      >
                        {deleting === u.id ? "..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
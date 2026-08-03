import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsersRound, Users, UserCircle, Trash2, Search } from "lucide-react";
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

export default function AdminGroups() {
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    fetchGroups();
  }, []);

  const fetchGroups = () => {
    axios.get(`${API}/communities`, { headers }).then(res => {
      setGroups(res.data);
      setFilteredGroups(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = groups.filter(g => 
      g.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will remove the entire group and all its data.`)) return;
    setDeleting(id);
    try {
      await axios.delete(`${API}/communities/${id}`, { headers });
      setGroups(groups.filter(g => g.id !== id));
      setFilteredGroups(filteredGroups.filter(g => g.id !== id));
    } catch (e) {
      alert("Failed to delete group.");
    }
    setDeleting(null);
  };

  return (
    <Layout user={user} onLogout={logout} role="admin" activePath="/admin/groups">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Groups</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>All savings groups ({filteredGroups.length})</p>
      </div>

      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#F9FAFB", borderRadius: 8, padding: "0 12px", border: "1px solid #E5E7EB" }}>
            <Search size={16} color="#9CA3AF" />
            <input 
              type="text" 
              placeholder="Search groups..." 
              value={searchTerm} 
              onChange={e => handleSearch(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: "none", background: "transparent", fontSize: 13, outline: "none", fontFamily: "inherit" }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#9CA3AF", padding: 40 }}>Loading groups...</div>
      ) : filteredGroups.length === 0 ? (
        <div style={{ ...card, textAlign: "center", padding: 60 }}>
          <UsersRound size={32} color="#D1D5DB" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 14, color: "#6B7280" }}>No groups found.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {filteredGroups.map(g => {
            const treasurer = g.members?.find(m => m.pivot?.role === "treasurer");
            const memberCount = g.members?.filter(m => m.pivot?.role === "member").length || 0;
            
            return (
              <div key={g.id} style={{ ...card }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 4 }}>{g.name}</div>
                    {g.description && (
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{g.description}</div>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDelete(g.id, g.name)}
                    disabled={deleting === g.id}
                    style={{ 
                      background: "none", 
                      border: "none", 
                      color: "#EF4444", 
                      cursor: "pointer", 
                      padding: 4,
                      opacity: deleting === g.id ? 0.5 : 1
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: "flex", gap: 20, fontSize: 12, color: "#6B7280", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <UserCircle size={14} /> 
                    <span>Treasurer: <span style={{ fontWeight: 600, color: "#111827" }}>{treasurer?.name || "—"}</span></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Users size={14} /> 
                    <span>Members: <span style={{ fontWeight: 600, color: "#111827" }}>{memberCount}</span></span>
                  </div>
                </div>

                {g.invite_code && (
                  <div style={{ 
                    background: "#F3F4F6", 
                    borderRadius: 6, 
                    padding: "4px 12px", 
                    fontSize: 11, 
                    color: "#6B7280", 
                    display: "inline-block",
                    marginBottom: 12
                  }}>
                    Invite: <span style={{ fontFamily: "monospace", fontWeight: 600, color: "#1E3A8A" }}>{g.invite_code}</span>
                  </div>
                )}

                <button 
                  onClick={() => navigate(`/admin/groups/${g.id}`)}
                  style={{ 
                    width: "100%", 
                    padding: "8px", 
                    background: "#F3F4F6", 
                    border: "none", 
                    borderRadius: 6, 
                    fontSize: 12, 
                    fontWeight: 500, 
                    color: "#374151", 
                    cursor: "pointer",
                    fontFamily: "inherit"
                  }}
                >
                  View Details →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
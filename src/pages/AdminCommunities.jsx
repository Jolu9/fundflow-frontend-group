import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, Users, Trash2, UserPlus } from "lucide-react";
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

export default function AdminCommunities() {
  const [user, setUser] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAddMember, setShowAddMember] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", treasurer_id: "" });
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState("");
  const [memberError, setMemberError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchCommunities = () => {
    axios.get(`${API}/communities`, { headers }).then(res => setCommunities(res.data)).catch(() => {});
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    fetchCommunities();
    axios.get(`${API}/users`, { headers }).then(res => setAllUsers(res.data)).catch(() => {});
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const handleCreate = async () => {
    if (!form.name || !form.treasurer_id) { setError("Name and treasurer are required."); return; }
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/communities`, form, { headers });
      setForm({ name: "", description: "", treasurer_id: "" });
      setShowForm(false);
      fetchCommunities();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create community.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this community? This cannot be undone.")) return;
    await axios.delete(`${API}/communities/${id}`, { headers });
    fetchCommunities();
  };

  const handleAddMember = async (communityId) => {
    if (!selectedUserId) { setMemberError("Select a member first."); return; }
    setMemberError("");
    try {
      await axios.post(`${API}/communities/${communityId}/add-member`, { user_id: selectedUserId }, { headers });
      setSelectedUserId("");
      setShowAddMember(null);
      fetchCommunities();
    } catch (e) {
      setMemberError(e.response?.data?.message || "Failed to add member.");
    }
  };

  const handleRemoveMember = async (communityId, userId) => {
    await axios.post(`${API}/communities/${communityId}/remove-member`, { user_id: userId }, { headers });
    fetchCommunities();
  };

  const treasurers = allUsers.filter(m => m.role === "treasurer");

  return (
    <Layout user={user} onLogout={logout} role="admin" activePath="/admin/communities">

      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Communities</h1>
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>{communities.length} community{communities.length !== 1 ? "s" : ""} on the platform</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          <Plus size={15} /> New Community
        </button>
      </div>

      {/* CREATE FORM MODAL */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 32, width: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Create Community</h3>
              <button onClick={() => { setShowForm(false); setError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={18} /></button>
            </div>
            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 16 }}>{error}</div>}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Community Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Lusaka Women's Group"
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
                onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Description (optional)</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." rows={3}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "vertical" }}
                onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
                onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Assign Treasurer</label>
              <select value={form.treasurer_id} onChange={e => setForm({ ...form, treasurer_id: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none" }}>
                <option value="">Select a treasurer</option>
                {treasurers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              {treasurers.length === 0 && <p style={{ fontSize: 12, color: "#F59E0B", marginTop: 6 }}>No treasurer accounts found. Create one first.</p>}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleCreate} disabled={loading}
                style={{ flex: 1, padding: "10px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {loading ? "Creating..." : "Create Community"}
              </button>
              <button onClick={() => { setShowForm(false); setError(""); }}
                style={{ padding: "10px 20px", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 7, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddMember && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 32, width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Manage Members</h3>
              <button onClick={() => { setShowAddMember(null); setMemberError(""); setSelectedUserId(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={18} /></button>
            </div>
            {memberError && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 16 }}>{memberError}</div>}

            {(() => {
              const comm = communities.find(c => c.id === showAddMember);
              const currentMembers = comm?.members?.filter(m => m.pivot?.role === "member") ?? [];
              return currentMembers.length > 0 ? (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 10 }}>Current Members</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {currentMembers.map(m => (
                      <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#F9FAFB", borderRadius: 7 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{m.name}</div>
                        <button onClick={() => handleRemoveMember(showAddMember, m.id)}
                          style={{ background: "none", border: "none", color: "#DC2626", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Add Member</label>
              <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none" }}>
                <option value="">Select a member</option>
                {allUsers.filter(u => u.role === "member").map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => handleAddMember(showAddMember)}
                style={{ flex: 1, padding: "10px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Add Member
              </button>
              <button onClick={() => { setShowAddMember(null); setMemberError(""); setSelectedUserId(""); }}
                style={{ padding: "10px 20px", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 7, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMMUNITIES LIST */}
      {communities.length === 0 ? (
        <div style={{ ...card, textAlign: "center", padding: "60px 24px" }}>
          <Users size={32} color="#D1D5DB" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 14, fontWeight: 500, color: "#6B7280", marginBottom: 4 }}>No communities yet</div>
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>Create your first community to get started.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {communities.map(c => {
            const treasurer = c.members?.find(m => m.pivot?.role === "treasurer");
            const memberCount = c.members?.filter(m => m.pivot?.role === "member").length ?? 0;
            return (
              <div key={c.id} style={{ ...card }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>{c.name}</div>
                    {c.description && <div style={{ fontSize: 12, color: "#9CA3AF" }}>{c.description}</div>}
                  </div>
                  <button onClick={() => handleDelete(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#D1D5DB", padding: 4 }}
                    onMouseEnter={e => e.currentTarget.style.color = "#DC2626"}
                    onMouseLeave={e => e.currentTarget.style.color = "#D1D5DB"}>
                    <Trash2 size={15} />
                  </button>
                </div>
                <div style={{ display: "flex", gap: 20, fontSize: 12, color: "#6B7280", marginBottom: 16 }}>
                  <div>Treasurer: <span style={{ fontWeight: 600, color: "#374151" }}>{treasurer?.name ?? "—"}</span></div>
                  <div>Members: <span style={{ fontWeight: 600, color: "#374151" }}>{memberCount}</span></div>
                </div>
                <button onClick={() => { setShowAddMember(c.id); setMemberError(""); setSelectedUserId(""); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#F7F8FA", color: "#374151", border: "1px solid #E8EAED", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                  <UserPlus size={13} /> Manage Members
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
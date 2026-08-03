import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, X, Check, UserX, Clock } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #E8EAED",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

export default function TreasurerUsers() {
  const [user, setUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchCommunity = () => {
    axios.get(`${API}/communities/my`, { headers }).then(res => {
      if (res.data.length === 0) return;
      const comm = res.data[0];
      setCommunity(comm);
      setMembers(comm.members?.filter(m => m.pivot?.role === "member") ?? []);
      fetchJoinRequests(comm.id);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  const fetchJoinRequests = (communityId) => {
    axios.get(`${API}/join-requests?community_id=${communityId}`, { headers }).then(res => setJoinRequests(res.data)).catch(() => {});
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    fetchCommunity();
    axios.get(`${API}/users`, { headers }).then(res => setAllMembers(res.data.filter(u => u.role === "member"))).catch(() => {});
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const handleAddMember = async () => {
    if (!selectedUserId) { setError("Select a member first."); return; }
    setError("");
    try {
      await axios.post(`${API}/communities/${community.id}/add-member`, { user_id: selectedUserId }, { headers });
      setSelectedUserId("");
      setShowAdd(false);
      fetchCommunity();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to add member.");
    }
  };

  const handleRemove = async (userId) => {
    if (!confirm("Remove this member from the community?")) return;
    await axios.post(`${API}/communities/${community.id}/remove-member`, { user_id: userId }, { headers });
    fetchCommunity();
  };

  const handleJoinRequest = async (id, status) => {
    try {
      await axios.patch(`${API}/join-requests/${id}`, { status }, { headers });
      fetchCommunity();
    } catch (e) {
      alert("Failed to update request.");
    }
  };

  return (
    <Layout user={user} onLogout={logout} role="treasurer" activePath="/treasurer/users">

      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Members</h1>
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>{members.length} member{members.length !== 1 ? "s" : ""} in {community?.name ?? "your community"}</p>
        </div>
        <button onClick={() => { setShowAdd(true); setError(""); }}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          <UserPlus size={15} /> Add Member
        </button>
      </div>

      {/* PENDING JOIN REQUESTS */}
      {joinRequests.length > 0 && (
        <div style={{ ...card, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Clock size={15} color="#D97706" />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Pending Join Requests</h3>
            <span style={{ background: "#FEF3C7", color: "#D97706", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{joinRequests.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {joinRequests.map(req => (
              <div key={req.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: "#FAFAFA", borderRadius: 10, border: "1px solid #F3F4F6" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {req.user?.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{req.user?.name}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>{req.user?.email}</div>
                </div>
                <button onClick={() => handleJoinRequest(req.id, "approved")}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#ECFDF5", color: "#059669", border: "1px solid #BBF7D0", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  <Check size={13} /> Approve
                </button>
                <button onClick={() => handleJoinRequest(req.id, "rejected")}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  <UserX size={13} /> Reject
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 32, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Add Member</h3>
              <button onClick={() => { setShowAdd(false); setError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={18} /></button>
            </div>
            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 16 }}>{error}</div>}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Select Member</label>
              <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none" }}>
                <option value="">Select a member</option>
                {allMembers.filter(m => !members.find(cm => cm.id === m.id)).map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              {allMembers.filter(m => !members.find(cm => cm.id === m.id)).length === 0 && (
                <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>All member accounts are already in this community.</p>
              )}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleAddMember}
                style={{ flex: 1, padding: "10px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Add Member
              </button>
              <button onClick={() => { setShowAdd(false); setError(""); }}
                style={{ padding: "10px 20px", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 7, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEMBERS TABLE */}
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9CA3AF" }}>Loading...</div>
        ) : members.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
            No members in this community yet. Add one above.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["#", "Name", "Email", "Phone", "Joined", ""].map(h => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #E5E7EB" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: "1px solid #F3F4F6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "#9CA3AF" }}>{i + 1}</td>
                  <td style={{ padding: "13px 20px", cursor: "pointer" }} onClick={() => navigate(`/treasurer/members/${m.id}`)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                        {m.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#2563EB" }}>{m.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "#6B7280" }}>{m.email}</td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "#6B7280" }}>{m.phone || "—"}</td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "#9CA3AF" }}>{new Date(m.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: "13px 20px" }}>
                    <button onClick={() => handleRemove(m.id)}
                      style={{ padding: "4px 12px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
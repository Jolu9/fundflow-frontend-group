import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, PlusCircle, ArrowLeft, Compass, Check, Clock } from "lucide-react";
import axios from "axios";

const API = "http://localhost:8000/api";

export default function Setup() {
  const [mode, setMode] = useState(null);
  const [createForm, setCreateForm] = useState({ name: "", description: "" });
  const [joinCode, setJoinCode] = useState("");
  const [preview, setPreview] = useState(null);
  const [joinRequested, setJoinRequested] = useState(false);
  const [joinedGroupName, setJoinedGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/communities/my`, { headers }).then(res => {
      if (res.data.length > 0) {
        navigate("/member");
      } else {
        setChecking(false);
      }
    }).catch(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (mode === "explore") {
      axios.get(`${API}/communities/explore`, { headers }).then(res => setGroups(res.data)).catch(() => {});
      axios.get(`${API}/join-requests/mine`, { headers }).then(res => setMyRequests(res.data)).catch(() => {});
    }
  }, [mode]);

  const checkCode = async (code) => {
    if (code.length < 6) { setPreview(null); return; }
    try {
      const res = await axios.get(`${API}/communities/invite/${code}`);
      setPreview(res.data);
      setError("");
    } catch {
      setPreview(null);
      setError("Invalid invite code.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.name) { setError("Community name is required."); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${API}/communities/create`, createForm, { headers });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "treasurer");
      navigate("/treasurer");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create community.");
    }
    setLoading(false);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinCode || !preview) { setError("Enter a valid invite code."); return; }
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/communities/join-by-code`, { invite_code: joinCode }, { headers });
      setJoinedGroupName(preview.name);
      setJoinRequested(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request.");
    }
    setLoading(false);
  };

  const handleRequestJoin = async (communityId) => {
    setError("");
    try {
      await axios.post(`${API}/join-requests`, { community_id: communityId }, { headers });
      const res = await axios.get(`${API}/join-requests/mine`, { headers });
      setMyRequests(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request.");
    }
  };

  const requestStatusFor = (communityId) => {
    const req = myRequests.find(r => r.community_id === communityId);
    return req?.status ?? null;
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0F2460, #1E3A8A, #2563EB)" }}>
        <div style={{ color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0F2460, #1E3A8A, #2563EB)",
        position: "relative",
        overflow: "hidden",
        padding: "40px 20px",
      }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.12 }} preserveAspectRatio="none">
          <defs>
            <pattern id="waves" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">
              <path d="M0 60 Q 30 30, 60 60 T 120 60 T 180 60 T 240 60" stroke="#fff" strokeWidth="1.5" fill="none" />
              <path d="M0 120 Q 30 90, 60 120 T 120 120 T 180 120 T 240 120" stroke="#fff" strokeWidth="1.5" fill="none" />
              <path d="M0 180 Q 30 150, 60 180 T 120 180 T 180 180 T 240 180" stroke="#fff" strokeWidth="1.5" fill="none" />
              <path d="M0 0 Q 30 -30, 60 0 T 120 0 T 180 0 T 240 0" stroke="#fff" strokeWidth="1.5" fill="none" />
              <path d="M0 240 Q 30 210, 60 240 T 120 240 T 180 240 T 240 240" stroke="#fff" strokeWidth="1.5" fill="none" />
              <path d="M30 0 Q 60 30, 30 60 T 30 120 T 30 180 T 30 240" stroke="#fff" strokeWidth="1" fill="none" opacity="0.6" />
              <path d="M150 0 Q 180 30, 150 60 T 150 120 T 150 180 T 150 240" stroke="#fff" strokeWidth="1" fill="none" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>

        <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: "rgba(255,255,255,0.05)", top: -120, left: -120 }} />
        <div style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: "rgba(255,255,255,0.04)", bottom: -100, right: -100 }} />

        <div style={{ position: "relative", zIndex: 1, width: mode === "explore" ? 600 : 500 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "44px 40px", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>

            {mode && !joinRequested && (
              <button onClick={() => { setMode(null); setError(""); setPreview(null); setJoinCode(""); setJoinRequested(false); }}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13, fontWeight: 500, fontFamily: "inherit", marginBottom: 20, padding: 0 }}>
                <ArrowLeft size={15} /> Back
              </button>
            )}

            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1E3A8A", marginBottom: 14 }}>
                Fund<span style={{ color: "#2563EB" }}>Flow</span>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Let's get you set up</h1>
            </div>

            {!mode && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div onClick={() => { setMode("create"); setError(""); }}
                  style={{ padding: "22px 14px", border: "1.5px solid #E8EAED", borderRadius: 14, cursor: "pointer", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "box-shadow 0.15s, border-color 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#BFDBFE"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8EAED"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <PlusCircle size={20} color="#2563EB" />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 6 }}>Create a Group</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.6 }}>Start a new group and become treasurer</div>
                </div>

                <div onClick={() => { setMode("join"); setError(""); }}
                  style={{ padding: "22px 14px", border: "1.5px solid #E8EAED", borderRadius: 14, cursor: "pointer", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "box-shadow 0.15s, border-color 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#BBF7D0"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8EAED"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <Users size={20} color="#059669" />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 6 }}>Join with Code</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.6 }}>Enter an invite code from your treasurer</div>
                </div>

                <div onClick={() => { setMode("explore"); setError(""); }}
                  style={{ padding: "22px 14px", border: "1.5px solid #E8EAED", borderRadius: 14, cursor: "pointer", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "box-shadow 0.15s, border-color 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#FDE68A"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8EAED"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <Compass size={20} color="#D97706" />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 6 }}>Explore Groups</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.6 }}>Browse groups and request to join</div>
                </div>
              </div>
            )}

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "11px 14px", borderRadius: 8, fontSize: 13, marginTop: 16 }}>
                {error}
              </div>
            )}

            {mode === "create" && (
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Group Name</label>
                  <input type="text" placeholder="e.g. Lusaka Women's Chilimba" value={createForm.name}
                    onChange={e => setCreateForm({ ...createForm, name: e.target.value })} required
                    style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#F9FAFB", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
                    onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Description <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span></label>
                  <textarea placeholder="Brief description of your group..." value={createForm.description}
                    onChange={e => setCreateForm({ ...createForm, description: e.target.value })} rows={3}
                    style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#F9FAFB", boxSizing: "border-box", resize: "vertical" }}
                    onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
                    onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: "100%", padding: "12px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  {loading ? "Creating..." : "Create Group →"}
                </button>
              </form>
            )}

            {mode === "join" && !joinRequested && (
              <form onSubmit={handleJoin}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Invite Code</label>
                  <input type="text" placeholder="e.g. AB12CD34" value={joinCode}
                    onChange={e => { setJoinCode(e.target.value.toUpperCase()); checkCode(e.target.value); }}
                    style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#F9FAFB", boxSizing: "border-box", letterSpacing: "0.08em" }}
                    onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
                    onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
                  {preview && (
                    <div style={{ marginTop: 8, padding: "10px 12px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 7, fontSize: 12, color: "#166534" }}>
                      You will request to join: <strong>{preview.name}</strong>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 24 }}>
                  <button type="submit" disabled={loading || !preview}
                    style={{ width: "100%", padding: "12px", background: preview ? "#1E3A8A" : "#E5E7EB", color: preview ? "#fff" : "#9CA3AF", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: preview ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                    {loading ? "Sending..." : "Request to Join →"}
                  </button>
                </div>
              </form>
            )}

            {mode === "join" && joinRequested && (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Clock size={26} color="#D97706" />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Request Sent</div>
                <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7 }}>
                  Your request to join <strong>{joinedGroupName}</strong> has been sent.<br />
                  The treasurer needs to approve you before you can access the group.
                </div>
              </div>
            )}

            {mode === "explore" && (
              <div>
                {groups.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#9CA3AF", fontSize: 13, padding: "30px 0" }}>No groups available yet.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 420, overflowY: "auto" }}>
                    {groups.map(g => {
                      const status = requestStatusFor(g.id);
                      return (
                        <div key={g.id} style={{ padding: "16px 18px", border: "1px solid #E8EAED", borderRadius: 12, display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15, fontWeight: 700, color: "#2563EB" }}>
                            {g.name?.[0]?.toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{g.name}</div>
                            <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                              {g.description || "No description"} · {g.member_count} member{g.member_count !== 1 ? "s" : ""}
                            </div>
                          </div>
                          {status === "pending" ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: "#FFFBEB", color: "#D97706", borderRadius: 7, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                              <Clock size={13} /> Pending
                            </div>
                          ) : status === "approved" ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: "#F0FDF4", color: "#059669", borderRadius: 7, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                              <Check size={13} /> Approved
                            </div>
                          ) : (
                            <button onClick={() => handleRequestJoin(g.id)}
                              style={{ padding: "7px 16px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                              Request to Join
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "#9CA3AF" }}>
              <span onClick={logout} style={{ color: "#2563EB", fontWeight: 600, cursor: "pointer" }}>Sign out</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
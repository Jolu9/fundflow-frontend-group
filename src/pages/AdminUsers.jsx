import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8000/api";

const Sidebar = ({ navigate, active }) => (
  <div style={{ width: 220, background: "#fff", minHeight: "calc(100vh - 60px)", borderRight: "1px solid #eee", padding: "24px 0" }}>
    {[
      { label: "Dashboard", icon: "🏠", path: "/admin" },
      { label: "Users", icon: "👤", path: "/admin/users" },
      { label: "Loans", icon: "💰", path: "/admin/loans" },
      { label: "Repayments", icon: "📋", path: "/admin/repayments" },
      { label: "Reports", icon: "📊", path: "/admin/reports" },
    ].map(item => (
      <div key={item.label} onClick={() => navigate(item.path)}
        style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontSize: 14, fontWeight: item.label === active ? 600 : 400, color: item.label === active ? "#0D1B5E" : "#666", background: item.label === active ? "#F0F4FF" : "transparent", borderLeft: item.label === active ? "3px solid #0D1B5E" : "3px solid transparent" }}>
        <span>{item.icon}</span> {item.label}
      </div>
    ))}
  </div>
);

const Navbar = ({ user, onLogout }) => (
  <div style={{ background: "#0D1B5E", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
    <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Fund<span style={{ color: "#4FC3F7" }}>Flow</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{user?.name}</span>
      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#4FC3F7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#0D1B5E" }}>{user?.name?.[0] ?? "A"}</div>
      <button onClick={onLogout} style={{ padding: "7px 16px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, fontSize: 13, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Logout</button>
    </div>
  </div>
);

export default function AdminUsers() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member", phone: "", national_id: "", address: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get(`${API}/users`, { headers }).then(res => setUsers(res.data)).catch(() => {});
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) { setError("Name, email and password are required."); return; }
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/users`, form, { headers });
      setForm({ name: "", email: "", password: "", role: "member", phone: "", national_id: "", address: "" });
      setShowForm(false);
      fetchUsers();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create user.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    await axios.delete(`${API}/users/${id}`, { headers });
    fetchUsers();
  };

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const roleBadge = (role) => {
    const styles = {
      admin: { background: "#E8EAF6", color: "#3949AB" },
      treasurer: { background: "#E0F2F1", color: "#00796B" },
      member: { background: "#F3E5F5", color: "#7B1FA2" },
    };
    const s = styles[role] || {};
    return <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, ...s }}>{role}</span>;
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", background: "#F4F6FB" }}>
        <Navbar user={user} onLogout={logout} />
        <div style={{ display: "flex" }}>
          <Sidebar navigate={navigate} active="Users" />
          <div style={{ flex: 1, padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0D1B5E", marginBottom: 4 }}>Users</h1>
                <p style={{ fontSize: 13, color: "#999" }}>{users.length} total users</p>
              </div>
              <button onClick={() => setShowForm(!showForm)} style={{ padding: "10px 22px", background: "#0D1B5E", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                + Add user
              </button>
            </div>

            {/* FORM */}
            {showForm && (
              <div style={{ background: "#fff", borderRadius: 12, padding: 28, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0D1B5E", marginBottom: 20 }}>New user</h3>
                {error && <div style={{ background: "#FFF0F0", border: "1px solid #FFCDD2", color: "#C62828", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
                  {[["Name", "name", "text"], ["Email", "email", "email"], ["Password", "password", "password"], ["Phone", "phone", "text"], ["National ID", "national_id", "text"], ["Address", "address", "text"]].map(([label, key, type]) => (
                    <div key={key}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 6 }}>{label}</label>
                      <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                        style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box" }} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 6 }}>Role</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    style={{ padding: "10px 12px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", outline: "none" }}>
                    <option value="member">Member</option>
                    <option value="treasurer">Treasurer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={handleSubmit} disabled={loading} style={{ padding: "10px 24px", background: "#0D1B5E", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                    {loading ? "Creating..." : "Create user"}
                  </button>
                  <button onClick={() => { setShowForm(false); setError(""); }} style={{ padding: "10px 24px", background: "#f5f5f5", color: "#444", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* TABLE */}
            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8F9FF" }}>
                    {["Name", "Email", "Role", "Phone", "National ID", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#666", borderBottom: "1px solid #eee" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#999", fontSize: 14 }}>No users yet. Add one above.</td></tr>
                  ) : users.map(u => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#0D1B5E" }}>{u.name}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#555" }}>{u.email}</td>
                      <td style={{ padding: "14px 16px" }}>{roleBadge(u.role)}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#555" }}>{u.phone || "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#555" }}>{u.national_id || "—"}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: u.status === "active" ? "#E8F5E9" : "#FFEBEE", color: u.status === "active" ? "#388E3C" : "#C62828" }}>{u.status}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <button onClick={() => handleDelete(u.id)} style={{ padding: "6px 14px", background: "#FFEBEE", color: "#C62828", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
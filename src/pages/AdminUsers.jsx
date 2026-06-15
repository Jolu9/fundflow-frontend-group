import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #E8EAED",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

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
      admin: { background: "#EFF6FF", color: "#2563EB" },
      treasurer: { background: "#ECFDF5", color: "#059669" },
      member: { background: "#F5F3FF", color: "#7C3AED" },
    };
    return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, ...(styles[role] || {}) }}>{role}</span>;
  };

  return (
    <Layout user={user} onLogout={logout} role="admin" activePath="/admin/users">

      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Users</h1>
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>{users.length} total user{users.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(true)}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          <Plus size={15} /> Add User
        </button>
      </div>

      {/* MODAL */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 32, width: 560, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>New User</h3>
              <button onClick={() => { setShowForm(false); setError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={18} /></button>
            </div>
            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 16 }}>{error}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              {[["Name", "name", "text"], ["Email", "email", "email"], ["Password", "password", "password"], ["Phone", "phone", "text"], ["National ID", "national_id", "text"], ["Address", "address", "text"]].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
                    onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                style={{ padding: "9px 12px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none" }}>
                <option value="member">Member</option>
                <option value="treasurer">Treasurer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleSubmit} disabled={loading}
                style={{ flex: 1, padding: "10px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {loading ? "Creating..." : "Create User"}
              </button>
              <button onClick={() => { setShowForm(false); setError(""); }}
                style={{ padding: "10px 20px", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 7, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div style={{ ...card, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Name", "Email", "Role", "Phone", "National ID", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #E8EAED" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No users yet.</td></tr>
            ) : users.map(u => (
              <tr key={u.id} style={{ borderBottom: "1px solid #F3F4F6" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280" }}>{u.email}</td>
                <td style={{ padding: "13px 16px" }}>{roleBadge(u.role)}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280" }}>{u.phone || "—"}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280" }}>{u.national_id || "—"}</td>
                <td style={{ padding: "13px 16px" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: u.status === "active" ? "#ECFDF5" : "#FEF2F2", color: u.status === "active" ? "#059669" : "#DC2626" }}>
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: "13px 16px" }}>
                  <button onClick={() => handleDelete(u.id)}
                    style={{ padding: "5px 12px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
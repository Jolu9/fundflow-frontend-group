import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UserCircle, Users, CreditCard } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #E8EAED",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

export default function AdminGroupDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });

    Promise.all([
      axios.get(`${API}/communities/${id}`, { headers }),
      axios.get(`${API}/contributions`, { headers }),
    ]).then(([groupRes, contribRes]) => {
      setGroup(groupRes.data);
      setContributions(contribRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  if (loading) return (
    <Layout user={user} onLogout={logout} role="admin" activePath="/admin/groups">
      <div style={{ color: "#9CA3AF", padding: 40 }}>Loading...</div>
    </Layout>
  );

  if (!group) return (
    <Layout user={user} onLogout={logout} role="admin" activePath="/admin/groups">
      <div style={{ color: "#9CA3AF", padding: 40 }}>Group not found.</div>
    </Layout>
  );

  const treasurer = group.members?.find(m => m.pivot?.role === "treasurer");
  const members = group.members?.filter(m => m.pivot?.role === "member") || [];

  // Total contributed by each member in this group
  const memberIds = group.members?.map(m => m.id) || [];
  const groupContribs = contributions.filter(c => memberIds.includes(c.user_id));

  const totalContributed = groupContribs.reduce((sum, c) => sum + Number(c.amount), 0);

  const contribByMember = {};
  groupContribs.forEach(c => {
    contribByMember[c.user_id] = (contribByMember[c.user_id] || 0) + Number(c.amount);
  });

  return (
    <Layout user={user} onLogout={logout} role="admin" activePath="/admin/groups">
      <button onClick={() => navigate("/admin/groups")}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#6B7280", fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginBottom: 20, padding: 0 }}>
        <ArrowLeft size={15} /> Back to Groups
      </button>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{group.name}</h1>
        {group.description && <p style={{ fontSize: 13, color: "#9CA3AF" }}>{group.description}</p>}
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Treasurer", value: treasurer?.name || "—", Icon: UserCircle, color: "#2563EB", bg: "#EFF6FF" },
          { label: "Members", value: members.length, Icon: Users, color: "#7C3AED", bg: "#F5F3FF" },
          { label: "Total Contributed", value: `K${totalContributed.toLocaleString()}`, Icon: CreditCard, color: "#059669", bg: "#F0FDF4" },
        ].map(({ label, value, Icon, color, bg }) => (
          <div key={label} style={{ ...card, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite code */}
      {group.invite_code && (
        <div style={{ ...card, padding: "14px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#6B7280" }}>Invite Code:</span>
          <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 15, color: "#1E3A8A", letterSpacing: "0.1em" }}>{group.invite_code}</span>
        </div>
      )}

      {/* Members table */}
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E8EAED" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Members</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Name", "Email", "Role", "Total Contributed"].map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #E8EAED" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.members?.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No members yet.</td></tr>
            ) : group.members?.map(m => (
              <tr key={m.id} style={{ borderBottom: "1px solid #F3F4F6" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: "#111827" }}>{m.name}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#6B7280" }}>{m.email}</td>
                <td style={{ padding: "13px 16px" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                    background: m.pivot?.role === "treasurer" ? "#EFF6FF" : "#F0FDF4",
                    color: m.pivot?.role === "treasurer" ? "#2563EB" : "#059669",
                  }}>
                    {m.pivot?.role === "treasurer" ? "Treasurer" : "Member"}
                  </span>
                </td>
                <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: "#059669" }}>
                  K{(contribByMember[m.id] || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
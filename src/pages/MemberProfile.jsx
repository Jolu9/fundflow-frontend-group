import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, CreditCard, Shield } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #E8EAED",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

export default function MemberProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const fields = [
    { label: "Full Name", value: user?.name, icon: User },
    { label: "Email Address", value: user?.email, icon: Mail },
    { label: "Phone Number", value: user?.phone || "—", icon: Phone },
    { label: "National ID", value: user?.national_id || "—", icon: CreditCard },
    { label: "Role", value: user?.role, icon: Shield },
  ];

  return (
    <Layout user={user} onLogout={logout} role="member" activePath="/member/profile">

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>My Profile</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>Your account details. Contact your administrator to make changes.</p>
      </div>

      <div style={{ maxWidth: 520 }}>
        <div style={{ background: "#1E3A8A", borderRadius: 14, padding: "24px 28px", marginBottom: 16, display: "flex", alignItems: "center", gap: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textTransform: "capitalize" }}>{user?.role} · FundFlow</div>
          </div>
        </div>

        <div style={{ ...card, overflow: "hidden" }}>
          {fields.map((field, i) => {
            const Icon = field.icon;
            return (
              <div key={field.label} style={{ padding: "16px 22px", display: "flex", alignItems: "center", gap: 14, borderBottom: i < fields.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={15} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{field.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", textTransform: field.label === "Role" ? "capitalize" : "none" }}>{field.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 14, textAlign: "center" }}>
          To update your details, contact your group administrator.
        </p>
      </div>
    </Layout>
  );
}
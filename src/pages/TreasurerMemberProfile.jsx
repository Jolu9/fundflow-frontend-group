import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CreditCard, PiggyBank, Calendar, Mail, Phone } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #E8EAED",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

export default function TreasurerMemberProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const [loans, setLoans] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });

    Promise.all([
      axios.get(`${API}/users/${id}`, { headers }),
      axios.get(`${API}/loans`, { headers }),
      axios.get(`${API}/contributions`, { headers }),
      axios.get(`${API}/repayments`, { headers }),
    ]).then(([memberRes, loansRes, contribRes, repayRes]) => {
      setMember(memberRes.data);
      setLoans(loansRes.data.filter(l => l.user_id === Number(id)));
      setContributions(contribRes.data.filter(c => c.user_id === Number(id)));
      setRepayments(repayRes.data.filter(r => r.loan?.user_id === Number(id)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const statusBadge = (status) => {
    const styles = {
      active: { background: "#ECFDF5", color: "#059669" },
      overdue: { background: "#FEF2F2", color: "#DC2626" },
      completed: { background: "#EFF6FF", color: "#2563EB" },
      pending: { background: "#FEF3C7", color: "#D97706" },
      rejected: { background: "#F3F4F6", color: "#6B7280" },
    };
    return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, ...(styles[status] || {}) }}>{status}</span>;
  };

  if (loading) return (
    <Layout user={user} onLogout={logout} role="treasurer" activePath="/treasurer/users">
      <div style={{ color: "#9CA3AF", padding: 40 }}>Loading...</div>
    </Layout>
  );

  if (!member) return (
    <Layout user={user} onLogout={logout} role="treasurer" activePath="/treasurer/users">
      <div style={{ color: "#9CA3AF", padding: 40 }}>Member not found.</div>
    </Layout>
  );

  const totalContributed = contributions.reduce((sum, c) => sum + Number(c.amount), 0);
  const totalBorrowed = loans.reduce((sum, l) => sum + Number(l.amount), 0);
  const totalRepaid = loans.reduce((sum, l) => sum + Number(l.amount_paid), 0);
  const totalOutstanding = Math.max(0, loans.reduce((sum, l) => sum + (Number(l.total_due) - Number(l.amount_paid)), 0));

  return (
    <Layout user={user} onLogout={logout} role="treasurer" activePath="/treasurer/users">
      <button onClick={() => navigate("/treasurer/users")}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#6B7280", fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginBottom: 20, padding: 0 }}>
        <ArrowLeft size={15} /> Back to Members
      </button>

      {/* PROFILE HEADER */}
      <div style={{ ...card, padding: 24, marginBottom: 20, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
          {member.name?.[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 6 }}>{member.name}</h1>
          <div style={{ display: "flex", gap: 18, fontSize: 13, color: "#6B7280" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Mail size={13} /> {member.email}</div>
            {member.phone && <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Phone size={13} /> {member.phone}</div>}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Calendar size={13} /> Joined {new Date(member.created_at).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Total Contributed", value: `K${totalContributed.toLocaleString()}`, color: "#059669" },
          { label: "Total Borrowed", value: `K${totalBorrowed.toLocaleString()}`, color: "#2563EB" },
          { label: "Total Repaid", value: `K${totalRepaid.toLocaleString()}`, color: "#10B981" },
          { label: "Outstanding", value: `K${totalOutstanding.toLocaleString()}`, color: totalOutstanding > 0 ? "#DC2626" : "#10B981" },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* LOANS */}
        <div style={{ ...card, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E8EAED", display: "flex", alignItems: "center", gap: 8 }}>
            <CreditCard size={15} color="#2563EB" />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Loans</h3>
          </div>
          {loans.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No loans yet.</div>
          ) : (
            <div style={{ maxHeight: 360, overflowY: "auto" }}>
              {loans.map(l => (
                <div key={l.id} style={{ padding: "14px 20px", borderBottom: "1px solid #F3F4F6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>K{Number(l.amount).toLocaleString()}</div>
                    {statusBadge(l.status)}
                  </div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                    {l.purpose && <>{l.purpose} · </>}
                    Paid K{Number(l.amount_paid).toLocaleString()} of K{Number(l.total_due).toLocaleString()}
                    {l.due_date && <> · Due {new Date(l.due_date).toLocaleDateString()}</>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONTRIBUTIONS */}
        <div style={{ ...card, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E8EAED", display: "flex", alignItems: "center", gap: 8 }}>
            <PiggyBank size={15} color="#059669" />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Contributions</h3>
          </div>
          {contributions.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No contributions yet.</div>
          ) : (
            <div style={{ maxHeight: 360, overflowY: "auto" }}>
              {contributions.map(c => (
                <div key={c.id} style={{ padding: "14px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#059669" }}>K{Number(c.amount).toLocaleString()}</div>
                    {c.notes && <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{c.notes}</div>}
                  </div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>{c.contribution_date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* REPAYMENT HISTORY */}
      <div style={{ ...card, overflow: "hidden", marginTop: 16 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E8EAED" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Repayment History</h3>
        </div>
        {repayments.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No repayments yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Date", "Loan Amount", "Amount Paid", "Notes"].map(h => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #E5E7EB" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {repayments.map(r => (
                <tr key={r.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#6B7280" }}>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#111827" }}>K{Number(r.loan?.amount).toLocaleString()}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#059669" }}>K{Number(r.amount).toLocaleString()}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#6B7280" }}>{r.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
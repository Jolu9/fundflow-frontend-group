import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle, XCircle, TrendingUp, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

function PieChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "#9CA3AF", fontSize: 13 }}>
      No loans yet
    </div>
  );

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 90;
  let angle = -90;

  const toXY = (angleDeg, radius) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const slices = data.filter(d => d.value > 0).map(d => {
    const pct = d.value / total;
    const start = angle;
    const sweep = pct >= 1 ? 359.99 : pct * 360;
    angle += sweep;
    return { ...d, pct, startAngle: start, endAngle: start + sweep };
  });

  const slicePath = (startAngle, endAngle) => {
    const s = toXY(startAngle, r);
    const e = toXY(endAngle, r);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {slices.map((s, i) => (
          <path key={i} d={slicePath(s.startAngle, s.endAngle)} fill={s.color} stroke="#fff" strokeWidth="2" />
        ))}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.map(d => (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: "#6B7280" }}>{d.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginLeft: "auto", paddingLeft: 16 }}>{d.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #E8EAED",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  padding: "22px 24px",
};

export default function TreasurerDashboard() {
  const [user, setUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [communityMembers, setCommunityMembers] = useState([]);
  const [loanStatus, setLoanStatus] = useState({ active: 0, pending: 0, overdue: 0, completed: 0 });
  const [pendingLoans, setPendingLoans] = useState([]);
  const [pendingContributions, setPendingContributions] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [allLoans, setAllLoans] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [totalDisbursed, setTotalDisbursed] = useState(0);
  const [totalRepaid, setTotalRepaid] = useState(0);
  const [inviteCode, setInviteCode] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });

    axios.get(`${API}/communities/my`, { headers }).then(res => {
      if (res.data.length === 0) return;
      const myComm = res.data[0];
      setCommunity(myComm);
      if (myComm.invite_code) setInviteCode(myComm.invite_code);
      const members = myComm.members?.filter(m => m.pivot?.role === "member") ?? [];
      setCommunityMembers(members);

      axios.get(`${API}/loans`, { headers }).then(loansRes => {
        const loans = loansRes.data.filter(l => String(l.community_id) === String(myComm.id));
        setAllLoans(loans);
        setLoanStatus({
          active: loans.filter(l => l.status === "active").length,
          pending: loans.filter(l => l.status === "pending").length,
          overdue: loans.filter(l => l.status === "overdue").length,
          completed: loans.filter(l => l.status === "completed").length,
        });
        setPendingLoans(loans.filter(l => l.status === "pending"));
        setActiveLoans(loans.filter(l => l.status === "active" || l.status === "overdue"));
        setTotalDisbursed(loans.filter(l => l.status !== "pending" && l.status !== "rejected").reduce((sum, l) => sum + Number(l.amount), 0));
        setTotalRepaid(loans.reduce((sum, l) => sum + Number(l.amount_paid), 0));
      }).catch(() => {});

      axios.get(`${API}/contributions`, { headers }).then(res => {
        setContributions(res.data.filter(c => String(c.community_id) === String(myComm.id)));
      }).catch(() => {});
    }).catch(() => {});

    axios.get(`${API}/contribution-requests`, { headers }).then(res => setPendingContributions(res.data)).catch(() => {});
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const generateInvite = async () => {
    const res = await axios.post(`${API}/communities/${community.id}/generate-invite`, {}, { headers });
    setInviteCode(res.data.invite_code);
    setShowInvite(true);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pieData = [
    { label: "Active", value: loanStatus.active, color: "#2563EB" },
    { label: "Pending", value: loanStatus.pending, color: "#F59E0B" },
    { label: "Overdue", value: loanStatus.overdue, color: "#EF4444" },
    { label: "Completed", value: loanStatus.completed, color: "#10B981" },
  ];

  const outstanding = totalDisbursed - totalRepaid;
  const collectionRate = totalDisbursed > 0 ? Math.round((totalRepaid / totalDisbursed) * 100) : 0;
  const activeLoanTotal = allLoans.filter(l => l.status === "active").reduce((sum, l) => sum + Number(l.amount), 0);
  const overdueLoanTotal = allLoans.filter(l => l.status === "overdue").reduce((sum, l) => sum + Number(l.total_due) - Number(l.amount_paid), 0);

  const repaymentBreakdown = [
    { label: "Active loans", value: `K${activeLoanTotal.toLocaleString()}`, color: "#2563EB", bg: "#EFF6FF", Icon: TrendingUp },
    { label: "Outstanding (unpaid)", value: `K${outstanding.toLocaleString()}`, color: "#D97706", bg: "#FFFBEB", Icon: Clock },
    { label: "Overdue", value: `K${overdueLoanTotal.toLocaleString()}`, color: "#DC2626", bg: "#FEF2F2", Icon: AlertTriangle },
    { label: "Completed repayments", value: `K${totalRepaid.toLocaleString()}`, color: "#059669", bg: "#F0FDF4", Icon: CheckCircle2 },
  ];

  const now = new Date();
  const thisMonth = contributions.filter(c => {
    const d = new Date(c.contribution_date || c.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalContributedThisMonth = thisMonth.reduce((sum, c) => sum + Number(c.amount), 0);
  const membersPaidIds = [...new Set(thisMonth.map(c => c.user_id))];

  const bellCard = (count, label, names, color, bg, destination) => count > 0 && (
    <div onClick={() => navigate(destination)}
      style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 14, padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "box-shadow 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
        <Bell size={18} color={color} />
        <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, background: "#EF4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", border: "2px solid #fff" }}>
          {count}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12, color: "#9CA3AF" }}>From: {names}</div>
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color }}>Review now →</span>
    </div>
  );

  return (
    <Layout user={user} onLogout={logout} role="treasurer" activePath="/treasurer">

      {/* WELCOME */}
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 3, letterSpacing: "-0.3px" }}>
            Welcome back, {user?.name}
          </h1>
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>
            {community
              ? <>Managing <span style={{ fontWeight: 600, color: "#1E3A8A" }}>{community.name}</span> · loan overview</>
              : "No community assigned yet."}
          </p>
        </div>

        {community && (
          <div style={{ textAlign: "right" }}>
            <button onClick={() => { if (!inviteCode) generateInvite(); else setShowInvite(v => !v); }}
              style={{ padding: "8px 16px", background: "#F0FDF4", color: "#059669", border: "1px solid #BBF7D0", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {showInvite ? "Hide Invite Code" : inviteCode ? "Show Invite Code" : "Generate Invite Code"}
            </button>
            {showInvite && inviteCode && (
              <div style={{ marginTop: 8, padding: "12px 16px", background: "#fff", border: "1px solid #E8EAED", borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", minWidth: 200 }}>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>Share with members to join</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#1E3A8A", letterSpacing: "0.15em", marginBottom: 8 }}>{inviteCode}</div>
                <div onClick={copyCode} style={{ fontSize: 11, color: copied ? "#059669" : "#2563EB", cursor: "pointer", fontWeight: 600 }}>
                  {copied ? "Copied!" : "Copy to clipboard"}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {bellCard(pendingLoans.length, `${pendingLoans.length} loan application${pendingLoans.length > 1 ? "s" : ""} awaiting review`, pendingLoans.map(l => l.user?.name ?? "Unknown").join(", "), "#D97706", "#FEF3C7", "/treasurer/loans")}
      {bellCard(pendingContributions.length, `${pendingContributions.length} contribution request${pendingContributions.length > 1 ? "s" : ""} awaiting confirmation`, pendingContributions.map(r => r.user?.name ?? "Unknown").join(", "), "#059669", "#F0FDF4", "/treasurer/contributions")}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ ...card }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 20 }}>Loan Status Breakdown</div>
          <PieChart data={pieData} />
        </div>
        <div style={{ ...card }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 20 }}>Repayment Breakdown</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {repaymentBreakdown.map((item, i) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: i < repaymentBreakdown.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <item.Icon size={16} color={item.color} strokeWidth={2} />
                </div>
                <div style={{ flex: 1, fontSize: 13, color: "#374151" }}>{item.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9CA3AF" }}>
            <span>Total disbursed</span>
            <span style={{ fontWeight: 600, color: "#374151" }}>K{totalDisbursed.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
        {[
          { label: "Outstanding Balance", value: `K${outstanding.toLocaleString()}`, sub: `K${totalRepaid.toLocaleString()} repaid of K${totalDisbursed.toLocaleString()}`, valueColor: outstanding > 0 ? "#EF4444" : "#10B981" },
          { label: "Collection Rate", value: `${collectionRate}%`, sub: `${collectionRate}% collected`, valueColor: collectionRate >= 70 ? "#10B981" : collectionRate >= 40 ? "#F59E0B" : "#EF4444", progress: collectionRate, progressColor: collectionRate >= 70 ? "#10B981" : collectionRate >= 40 ? "#F59E0B" : "#EF4444" },
          { label: "Members", value: communityMembers.length, sub: `in ${community?.name ?? "this community"}`, valueColor: "#111827" },
        ].map(c => (
          <div key={c.label} style={{ ...card }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: c.valueColor, letterSpacing: "-0.5px", marginBottom: 6 }}>{c.value}</div>
            {c.progress !== undefined && (
              <div style={{ background: "#F3F4F6", borderRadius: 99, height: 5, marginBottom: 6 }}>
                <div style={{ width: `${c.progress}%`, background: c.progressColor, height: 5, borderRadius: 99 }} />
              </div>
            )}
            <div style={{ fontSize: 12, color: "#9CA3AF" }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...card }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 20 }}>Repayment Progress</div>
          {activeLoans.length === 0 ? (
            <div style={{ color: "#9CA3AF", fontSize: 13 }}>No active loans.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {activeLoans.map(loan => {
                const progress = Math.min((Number(loan.amount_paid) / Number(loan.total_due)) * 100, 100);
                const remaining = Number(loan.total_due) - Number(loan.amount_paid);
                const isOverdue = loan.status === "overdue";
                return (
                  <div key={loan.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{loan.user?.name ?? "—"}</div>
                      <div style={{ fontSize: 11, color: isOverdue ? "#EF4444" : "#9CA3AF", fontWeight: isOverdue ? 600 : 400 }}>
                        {isOverdue ? "⚠ Overdue" : `K${remaining.toLocaleString()} left`}
                      </div>
                    </div>
                    <div style={{ background: "#F3F4F6", borderRadius: 99, height: 6 }}>
                      <div style={{ width: `${progress}%`, background: isOverdue ? "#EF4444" : "#2563EB", height: 6, borderRadius: 99, transition: "width 0.4s" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>K{Number(loan.amount_paid).toLocaleString()} of K{Number(loan.total_due).toLocaleString()}</div>
                      {loan.due_date && <div style={{ fontSize: 11, color: "#9CA3AF" }}>Due {new Date(loan.due_date).toLocaleDateString()}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ ...card }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Contributions This Month</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#10B981" }}>K{totalContributedThisMonth.toLocaleString()}</div>
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 16 }}>
            {membersPaidIds.length} of {communityMembers.length} members paid
          </div>
          {communityMembers.length === 0 ? (
            <div style={{ fontSize: 13, color: "#9CA3AF" }}>No members yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {communityMembers.map(m => {
                const paid = membersPaidIds.includes(m.id);
                const amount = thisMonth.filter(c => c.user_id === m.id).reduce((sum, c) => sum + Number(c.amount), 0);
                return (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, background: paid ? "#F0FDF4" : "#FFF7F7", border: `1px solid ${paid ? "#BBF7D0" : "#FEE2E2"}` }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: paid ? "#10B981" : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {paid ? <CheckCircle size={13} color="#fff" /> : <XCircle size={13} color="#9CA3AF" />}
                    </div>
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "#111827" }}>{m.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: paid ? "#10B981" : "#EF4444" }}>
                      {paid ? `K${amount.toLocaleString()}` : "Not paid"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <button onClick={() => navigate("/treasurer/contributions")}
            style={{ marginTop: 14, width: "100%", padding: "8px", background: "none", border: "1px solid #E5E7EB", borderRadius: 7, fontSize: 12, color: "#6B7280", cursor: "pointer", fontFamily: "inherit" }}>
            View all contributions →
          </button>
        </div>
      </div>
    </Layout>
  );
}
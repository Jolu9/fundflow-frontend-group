import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle, XCircle, UserPlus, PiggyBank, Wallet } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

function MonthlyBarChart({ contributions }) {
  const now = new Date();
  const year = now.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => ({
    year,
    month: i,
    label: new Date(year, i, 1).toLocaleDateString("en-GB", { month: "short" }),
  }));

  const totals = months.map(m => {
    const sum = contributions
      .filter(c => {
        const cd = new Date(c.contribution_date || c.created_at);
        return cd.getFullYear() === m.year && cd.getMonth() === m.month;
      })
      .reduce((s, c) => s + Number(c.amount), 0);
    return { ...m, total: sum };
  });

  const max = Math.max(...totals.map(t => t.total), 1);
  const hasAny = totals.some(t => t.total > 0);
  const chartHeight = 140;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: chartHeight, marginBottom: 10 }}>
        {totals.map(t => {
          const barHeight = hasAny ? Math.max((t.total / max) * (chartHeight - 26), t.total > 0 ? 4 : 2) : 2;
          const isCurrent = t.month === now.getMonth();
          return (
            <div key={t.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
              {t.total > 0 && (
                <div style={{ fontSize: 9, fontWeight: 700, color: isCurrent ? "#059669" : "#9CA3AF" }}>
                  K{t.total >= 1000 ? `${(t.total / 1000).toFixed(1)}k` : t.total.toLocaleString()}
                </div>
              )}
              <div style={{
                width: "100%",
                maxWidth: 26,
                height: barHeight,
                borderRadius: "6px 6px 2px 2px",
                background: t.total === 0 ? "#F3F4F6" : (isCurrent ? "linear-gradient(180deg, #10B981, #059669)" : "#A7F3D0"),
              }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {totals.map(t => (
          <div key={`label-${t.month}`} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#9CA3AF" }}>{t.label}</div>
        ))}
      </div>
      {!hasAny && (
        <div style={{ textAlign: "center", fontSize: 12, color: "#D1D5DB", marginTop: 10 }}>No contributions recorded yet</div>
      )}
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
  const [pendingLoans, setPendingLoans] = useState([]);
  const [pendingContributions, setPendingContributions] = useState([]);
  const [pendingJoinRequests, setPendingJoinRequests] = useState([]);
  const [pendingRepayments, setPendingRepayments] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
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
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.removeItem("token"); navigate("/login"); });

    axios.get(`${API}/communities/my`, { headers }).then(res => {
      if (res.data.length === 0) return;
      const myComm = res.data[0];
      setCommunity(myComm);
      if (myComm.invite_code) setInviteCode(myComm.invite_code);
      const members = myComm.members?.filter(m => m.pivot?.role === "member") ?? [];
      setCommunityMembers(members);

      axios.get(`${API}/loans`, { headers }).then(loansRes => {
        const loans = loansRes.data.filter(l => String(l.community_id) === String(myComm.id));
        setPendingLoans(loans.filter(l => l.status === "pending"));
        setActiveLoans(loans.filter(l => l.status === "active" || l.status === "overdue"));
        setTotalDisbursed(loans.filter(l => l.status !== "pending" && l.status !== "rejected").reduce((sum, l) => sum + Number(l.amount), 0));
        setTotalRepaid(loans.reduce((sum, l) => sum + Number(l.amount_paid), 0));
      }).catch(() => {});

      axios.get(`${API}/contributions`, { headers }).then(res => {
        setContributions(res.data.filter(c => String(c.community_id) === String(myComm.id)));
      }).catch(() => {});

      axios.get(`${API}/join-requests?community_id=${myComm.id}`, { headers }).then(res => {
        setPendingJoinRequests(res.data);
      }).catch(() => {});
    }).catch(() => {});

    axios.get(`${API}/contribution-requests`, { headers }).then(res => setPendingContributions(res.data)).catch(() => {});
    axios.get(`${API}/repayment-requests`, { headers }).then(res => setPendingRepayments(res.data)).catch(() => {});
  }, []);

  const logout = () => {
  axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.removeItem("token"); navigate("/login"); });
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

  const totalContributedAllTime = contributions.reduce((sum, c) => sum + Number(c.amount), 0);
  const currentFund = Math.max(0, totalContributedAllTime + totalRepaid - totalDisbursed);

  const now = new Date();
  const thisMonth = contributions.filter(c => {
    const d = new Date(c.contribution_date || c.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalContributedThisMonth = thisMonth.reduce((sum, c) => sum + Number(c.amount), 0);
  const membersPaidIds = [...new Set(thisMonth.map(c => c.user_id))];
  const topActiveLoans = activeLoans.slice(0, 3);

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

      {/* WELCOME + INVITE BUTTON */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
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
        <button
          onClick={() => { if (!inviteCode) generateInvite(); else setShowInvite(v => !v); }}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", background: "#EFF6FF", color: "#2563EB", border: "1px solid #DBEAFE", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
          <UserPlus size={14} color="#2563EB" />
          {showInvite ? "Hide code" : "Invite Members"}
        </button>
      </div>

      {showInvite && inviteCode && (
        <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>Share with members to join</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1E3A8A", letterSpacing: "0.15em" }}>{inviteCode}</div>
          </div>
          <button onClick={copyCode}
            style={{ marginLeft: "auto", padding: "8px 16px", background: copied ? "#F0FDF4" : "#EFF6FF", color: copied ? "#059669" : "#2563EB", border: `1px solid ${copied ? "#BBF7D0" : "#DBEAFE"}`, borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {copied ? "Copied!" : "Copy code"}
          </button>
        </div>
      )}

      {bellCard(pendingJoinRequests.length, `${pendingJoinRequests.length} join request${pendingJoinRequests.length > 1 ? "s" : ""} awaiting approval`, pendingJoinRequests.map(r => r.user?.name ?? "Unknown").join(", "), "#7C3AED", "#F5F3FF", "/treasurer/users")}
      {bellCard(pendingLoans.length, `${pendingLoans.length} loan application${pendingLoans.length > 1 ? "s" : ""} awaiting review`, pendingLoans.map(l => l.user?.name ?? "Unknown").join(", "), "#D97706", "#FEF3C7", "/treasurer/loans")}
      {bellCard(pendingContributions.length, `${pendingContributions.length} contribution request${pendingContributions.length > 1 ? "s" : ""} awaiting confirmation`, pendingContributions.map(r => r.user?.name ?? "Unknown").join(", "), "#059669", "#F0FDF4", "/treasurer/contributions")}
      {bellCard(pendingRepayments.length, `${pendingRepayments.length} repayment${pendingRepayments.length > 1 ? "s" : ""} awaiting confirmation`, pendingRepayments.map(r => r.user?.name ?? "Unknown").join(", "), "#2563EB", "#EFF6FF", "/treasurer/repayments")}

      {/* GROUP FUND */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <Wallet size={15} color="#9CA3AF" />
          <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>Group Fund</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>Current Fund</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>K{currentFund.toLocaleString()}</div>
          </div>
          <div style={{ borderLeft: "1px solid #F3F4F6", paddingLeft: 16 }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>Total Contributed</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#374151" }}>K{totalContributedAllTime.toLocaleString()}</div>
          </div>
          <div style={{ borderLeft: "1px solid #F3F4F6", paddingLeft: 16 }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>Total Disbursed</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#374151" }}>K{totalDisbursed.toLocaleString()}</div>
          </div>
          <div style={{ borderLeft: "1px solid #F3F4F6", paddingLeft: 16 }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>Total Repaid</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#374151" }}>K{totalRepaid.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* BAR CHART */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Contributions, {now.getFullYear()}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>K{totalContributedThisMonth.toLocaleString()} this month</div>
        </div>
        <MonthlyBarChart contributions={contributions} />
      </div>

      {/* CONTRIBUTIONS THIS MONTH + REPAYMENT PROGRESS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...card }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PiggyBank size={16} color="#059669" />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Contributions This Month</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#10B981" }}>K{totalContributedThisMonth.toLocaleString()}</div>
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 16, marginTop: 6 }}>
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
            style={{ marginTop: 14, width: "100%", padding: "8px", background: "linear-gradient(135deg, #059669, #10B981)", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
            View all contributions →
          </button>
        </div>

        <div style={{ ...card }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Repayment Progress</div>
            {activeLoans.length > 0 && (
              <span onClick={() => navigate("/treasurer/loans")} style={{ fontSize: 11, fontWeight: 600, color: "#2563EB", cursor: "pointer" }}>
                View all loans →
              </span>
            )}
          </div>
          {activeLoans.length === 0 ? (
            <div style={{ color: "#9CA3AF", fontSize: 13 }}>No active loans.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {topActiveLoans.map(loan => {
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
              {activeLoans.length > 3 && (
                <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center" }}>+{activeLoans.length - 3} more loan{activeLoans.length - 3 > 1 ? "s" : ""}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
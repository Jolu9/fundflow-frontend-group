import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, AlertTriangle, CheckCircle, Wallet, Landmark, PiggyBank, ShieldCheck, Bell } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #E8EAED",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

export default function MemberDashboard() {
  const [user, setUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [treasurer, setTreasurer] = useState(null);
  const [fundSummary, setFundSummary] = useState(null);
  const [loans, setLoans] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [contributionRequests, setContributionRequests] = useState([]);
  const [repaymentRequests, setRepaymentRequests] = useState([]);
  const [checkingCommunity, setCheckingCommunity] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.removeItem("token"); navigate("/login"); });
    axios.get(`${API}/member/loans`, { headers }).then(res => setLoans(res.data)).catch(() => {});
    axios.get(`${API}/member/contributions`, { headers }).then(res => setContributions(res.data)).catch(() => {});
    axios.get(`${API}/contribution-requests/mine`, { headers }).then(res => setContributionRequests(res.data)).catch(() => {});
    axios.get(`${API}/repayment-requests/mine`, { headers }).then(res => setRepaymentRequests(res.data)).catch(() => {});
    axios.get(`${API}/notifications`, { headers }).then(res => setNotifications(res.data)).catch(() => {});
    axios.get(`${API}/communities/my`, { headers }).then(res => {
      if (res.data.length > 0) {
        const comm = res.data[0];
        setCommunity(comm);
        const t = comm.members?.find(m => m.pivot?.role === "treasurer");
        if (t) setTreasurer(t);
        if (comm.fund_summary) setFundSummary(comm.fund_summary);
        setCheckingCommunity(false);
      } else {
        navigate("/setup");
      }
    }).catch(() => setCheckingCommunity(false));
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.removeItem("token"); navigate("/login"); });
  };

  if (checkingCommunity) return null;

  const activeLoans = loans.filter(l => l.status === "active");
  const overdueLoans = loans.filter(l => l.status === "overdue");
  const currentLoans = [...activeLoans, ...overdueLoans];
  const activeBalance = currentLoans.reduce((sum, l) => sum + (Number(l.total_due) - Number(l.amount_paid)), 0);
  const totalPaid = loans.reduce((sum, l) => sum + Number(l.amount_paid), 0);
  const totalContributed = contributions.reduce((sum, c) => sum + Number(c.amount), 0);
  const recentContributions = [...contributions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4);

  const dismissNotif = (id) => {
    axios.post(`${API}/notifications/${id}/dismiss`, {}, { headers }).catch(() => {});
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const goToNotif = (item) => {
    dismissNotif(item.id);
    navigate(item.route);
  };

  const cards = [
    { label: "Active Loans", value: activeLoans.length, icon: CreditCard, color: "#2563EB" },
    { label: "Overdue Loans", value: overdueLoans.length, icon: AlertTriangle, color: "#DC2626" },
    { label: "Total Paid", value: `K${totalPaid.toLocaleString()}`, icon: CheckCircle, color: "#059669" },
    { label: "Balance Remaining", value: `K${activeBalance.toLocaleString()}`, icon: Wallet, color: "#7C3AED" },
  ];

  return (
    <Layout user={user} onLogout={logout} role="member" activePath="/member">

      {/* WELCOME + TREASURER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
            Welcome back, {user?.name}
          </h1>
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>
            {community
              ? <>Member of <span style={{ fontWeight: 600, color: "#1E3A8A" }}>{community.name}</span></>
              : "You're not in a community yet."}
          </p>
        </div>

        {treasurer && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F8FAFF", border: "1px solid #DBEAFE", borderRadius: 10, padding: "10px 16px" }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ShieldCheck size={16} color="#2563EB" />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Your Treasurer</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{treasurer.name}</div>
              {treasurer.phone && <div style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>{treasurer.phone}</div>}
              {treasurer.email && <div style={{ fontSize: 11, color: "#6B7280" }}>{treasurer.email}</div>}
            </div>
          </div>
        )}
      </div>

      {/* NOTIFICATIONS */}
      {notifications.map(item => {
        const isPositive = item.status === "active" || item.status === "confirmed";
        return (
          <div key={item.id} onClick={() => goToNotif(item)}
            style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 14, padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "box-shadow 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: isPositive ? "#F0FDF4" : "#FEF2F2",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative"
            }}>
              <Bell size={18} color={isPositive ? "#059669" : "#DC2626"} />
              <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, background: "#EF4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", border: "2px solid #fff" }}>
                1
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>{item.subtitle}</div>
            </div>
            <span onClick={(e) => { e.stopPropagation(); dismissNotif(item.id); }}
              style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", padding: 6, cursor: "pointer" }}>
              ✕
            </span>
          </div>
        );
      })}

      {/* GROUP FUND */}
      {fundSummary && (
        <div style={{ ...card, padding: "18px 24px", marginBottom: 20, display: "flex", gap: 32, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
            <Wallet size={15} color="#9CA3AF" />
            <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>Group Fund</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 3 }}>Current Fund</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>K{Number(fundSummary.current_fund).toLocaleString()}</div>
          </div>
          <div style={{ borderLeft: "1px solid #F3F4F6", paddingLeft: 32 }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 3 }}>Total Contributed</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>K{Number(fundSummary.total_contributed).toLocaleString()}</div>
          </div>
          <div style={{ borderLeft: "1px solid #F3F4F6", paddingLeft: 32 }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 3 }}>Total Disbursed</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>K{Number(fundSummary.total_disbursed).toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* OVERDUE WARNING */}
      {overdueLoans.length > 0 && (
        <div style={{
          background: "#FEF2F2", border: "1.5px solid #FECACA", borderLeft: "4px solid #DC2626",
          borderRadius: 10, padding: "14px 20px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
        }} onClick={() => navigate("/member/loans")}>
          <AlertTriangle size={18} color="#DC2626" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", marginBottom: 2 }}>
              You have {overdueLoans.length} overdue loan{overdueLoans.length > 1 ? "s" : ""}
            </div>
            <div style={{ fontSize: 12, color: "#B91C1C" }}>Please contact your treasurer to arrange repayment.</div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#DC2626" }}>View →</div>
        </div>
      )}

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        {cards.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} style={{ ...card, padding: "20px 22px" }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#9CA3AF", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: c.color, marginBottom: 8 }}>{c.value}</div>
              <Icon size={15} color={c.color} strokeWidth={2} />
            </div>
          );
        })}
      </div>

      {/* QUICK ACTION TILES */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div onClick={() => navigate("/member/apply")} style={{ position: "relative", borderRadius: 14, overflow: "hidden", cursor: "pointer", boxShadow: "0 4px 20px rgba(37,99,235,0.25)" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1E3A8A, #2563EB)", opacity: 0.92 }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12), transparent 60%)" }} />
          <div style={{ position: "relative", zIndex: 1, padding: "22px 24px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Landmark size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Apply for Loan</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Submit a new loan application</div>
            </div>
          </div>
        </div>

        <div onClick={() => navigate("/member/contributions")} style={{ position: "relative", borderRadius: 14, overflow: "hidden", cursor: "pointer", boxShadow: "0 4px 20px rgba(5,150,105,0.25)" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #065F46, #059669)", opacity: 0.92 }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12), transparent 60%)" }} />
          <div style={{ position: "relative", zIndex: 1, padding: "22px 24px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <PiggyBank size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Make Contribution</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Record a new savings contribution</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* CURRENT LOANS */}
        <div style={{ ...card, padding: "22px 24px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 20 }}>Current Loans</div>
          {currentLoans.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0" }}>
              <div style={{ fontSize: 13, color: "#9CA3AF" }}>No active loans.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {currentLoans.map(loan => {
                const progress = Math.min((Number(loan.amount_paid) / Number(loan.total_due)) * 100, 100);
                const remaining = Number(loan.total_due) - Number(loan.amount_paid);
                const isOverdue = loan.status === "overdue";
                const daysUntilDue = loan.due_date
                  ? Math.ceil((new Date(loan.due_date) - new Date()) / (1000 * 60 * 60 * 24))
                  : null;
                return (
                  <div key={loan.id} style={{ paddingBottom: 20, borderBottom: "1px solid #F3F4F6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Loan Amount</div>
                        <div style={{ fontSize: 26, fontWeight: 700, color: "#111827" }}>K{Number(loan.amount).toLocaleString()}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500, marginBottom: 4 }}>Due date</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: isOverdue ? "#DC2626" : "#374151" }}>{loan.due_date ?? "—"}</div>
                        {daysUntilDue !== null && !isOverdue && (
                          <div style={{ fontSize: 11, color: daysUntilDue <= 7 ? "#D97706" : "#9CA3AF", marginTop: 2 }}>
                            {daysUntilDue <= 0 ? "Due today" : `${daysUntilDue} days left`}
                          </div>
                        )}
                        {isOverdue && <div style={{ fontSize: 11, color: "#DC2626", fontWeight: 600, marginTop: 2 }}>Overdue</div>}
                      </div>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>Repayment progress</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{Math.round(progress)}%</div>
                      </div>
                      <div style={{ background: "#F3F4F6", borderRadius: 99, height: 7 }}>
                        <div style={{ width: `${progress}%`, background: isOverdue ? "#DC2626" : "#2563EB", height: 7, borderRadius: 99, transition: "width 0.4s" }} />
                      </div>
                    </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6B7280" }}>
                      <span>Paid: <span style={{ fontWeight: 600, color: "#059669" }}>K{Number(loan.amount_paid).toLocaleString()}</span></span>
                      <span>Remaining: <span style={{ fontWeight: 600, color: isOverdue ? "#DC2626" : "#374151" }}>K{remaining.toLocaleString()}</span></span>
                    </div>
                    {Number(loan.penalty_amount) > 0 && (
                      <div style={{ marginTop: 6, fontSize: 11, color: "#DC2626", fontWeight: 600 }}>
                        ⚠ 5% overdue penalty applied: K{Number(loan.penalty_amount).toLocaleString()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CONTRIBUTIONS */}
        <div style={{ ...card, padding: "22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PiggyBank size={16} color="#059669" />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>My Contributions</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#059669" }}>K{totalContributed.toLocaleString()}</div>
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 16 }}>
            {contributions.length} contribution{contributions.length !== 1 ? "s" : ""} total
          </div>

          {recentContributions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <PiggyBank size={36} color="#D1D5DB" style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 13, color: "#9CA3AF" }}>No contributions yet.</div>
              <div style={{ fontSize: 12, color: "#D1D5DB", marginTop: 4 }}>Your savings will appear here.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentContributions.map((c, i) => (
                <div key={c.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 14px", borderRadius: 10,
                  background: i === 0 ? "linear-gradient(135deg, #F0FDF4, #DCFCE7)" : "#F9FAFB",
                  border: `1px solid ${i === 0 ? "#BBF7D0" : "#F3F4F6"}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? "#059669" : "#D1D5DB", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>K{Number(c.amount).toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>
                        {new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#059669" }}>
                    <CheckCircle size={13} color="#059669" /> Paid
                  </div>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => navigate("/member/contributions")}
            style={{ marginTop: 16, width: "100%", padding: "9px", background: "linear-gradient(135deg, #059669, #10B981)", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            View all contributions →
          </button>
        </div>
      </div>
    </Layout>
  );
}
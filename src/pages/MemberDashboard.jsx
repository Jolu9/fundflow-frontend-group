import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, AlertTriangle, CheckCircle, Wallet, FileText, ClipboardList } from "lucide-react";
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
  const [loans, setLoans] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [checkingCommunity, setCheckingCommunity] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    axios.get(`${API}/member/loans`, { headers }).then(res => setLoans(res.data)).catch(() => {});
    axios.get(`${API}/member/contributions`, { headers }).then(res => setContributions(res.data)).catch(() => {});
    axios.get(`${API}/communities/my`, { headers }).then(res => {
      if (res.data.length > 0) {
        setCommunity(res.data[0]);
        setCheckingCommunity(false);
      } else {
        navigate("/setup");
      }
    }).catch(() => setCheckingCommunity(false));
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  if (checkingCommunity) return null;

  const activeLoans = loans.filter(l => l.status === "active");
  const overdueLoans = loans.filter(l => l.status === "overdue");
  const currentLoans = [...activeLoans, ...overdueLoans];
  const activeBalance = currentLoans.reduce((sum, l) => sum + (Number(l.total_due) - Number(l.amount_paid)), 0);
  const totalPaid = loans.reduce((sum, l) => sum + Number(l.amount_paid), 0);
  const totalContributed = contributions.reduce((sum, c) => sum + Number(c.amount), 0);
  const recentContributions = [...contributions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4);

  const cards = [
    { label: "Active Loans", value: activeLoans.length, icon: CreditCard, color: "#2563EB" },
    { label: "Overdue Loans", value: overdueLoans.length, icon: AlertTriangle, color: "#DC2626" },
    { label: "Total Paid", value: `K${totalPaid.toLocaleString()}`, icon: CheckCircle, color: "#059669" },
    { label: "Balance Remaining", value: `K${activeBalance.toLocaleString()}`, icon: Wallet, color: "#7C3AED" },
  ];

  return (
    <Layout user={user} onLogout={logout} role="member" activePath="/member">

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
          Welcome back, {user?.name}
        </h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>
          {community
            ? <>Member of <span style={{ fontWeight: 600, color: "#1E3A8A" }}>{community.name}</span></>
            : "You're not in a community yet."}
        </p>
      </div>

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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* CURRENT LOANS */}
        <div style={{ ...card, padding: "22px 24px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 20 }}>Current Loans</div>
          {currentLoans.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0" }}>
              <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 16 }}>No active loans.</div>
              <button onClick={() => navigate("/member/apply")}
                style={{ padding: "9px 24px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Apply for a Loan
              </button>
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
                  </div>
                );
              })}
              <button onClick={() => navigate("/member/repayments")}
                style={{ width: "100%", padding: "10px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                View Repayments
              </button>
            </div>
          )}
        </div>

        {/* RECENT CONTRIBUTIONS */}
        <div style={{ ...card, padding: "22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>My Contributions</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>K{totalContributed.toLocaleString()}</div>
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>
            {contributions.length} contribution{contributions.length !== 1 ? "s" : ""} total
          </div>
          {recentContributions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0", color: "#9CA3AF", fontSize: 13 }}>No contributions yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentContributions.map(c => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #F3F4F6" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#059669" }}>K{Number(c.amount).toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                      {new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <CheckCircle size={16} color="#059669" />
                </div>
              ))}
            </div>
          )}
          <button onClick={() => navigate("/member/contributions")}
            style={{ marginTop: 16, width: "100%", padding: "8px", background: "none", border: "1px solid #E8EAED", borderRadius: 7, fontSize: 12, color: "#6B7280", cursor: "pointer", fontFamily: "inherit" }}>
            View all contributions →
          </button>
        </div>
      </div>

      {/* QUICK LINKS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { label: "Apply for Loan", desc: "Submit a new loan application", path: "/member/apply", icon: FileText, color: "#2563EB" },
          { label: "View Repayments", desc: "See your full repayment history", path: "/member/repayments", icon: ClipboardList, color: "#059669" },
        ].map(a => {
          const Icon = a.icon;
          return (
            <div key={a.label} onClick={() => navigate(a.path)}
              style={{ ...card, padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#BFDBFE"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#E8EAED"}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: "#F7F8FA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={17} color={a.color} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{a.label}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{a.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
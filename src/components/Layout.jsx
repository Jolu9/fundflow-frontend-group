import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, ClipboardList, BarChart3, FileText, UserCircle, LogOut } from "lucide-react";

const adminNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Loans", icon: CreditCard, path: "/admin/loans" },
  { label: "Repayments", icon: ClipboardList, path: "/admin/repayments" },
  { label: "Reports", icon: BarChart3, path: "/admin/reports" },
];

const memberNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/member" },
  { label: "My Loans", icon: CreditCard, path: "/member/loans" },
  { label: "Apply for Loan", icon: FileText, path: "/member/apply" },
  { label: "Repayments", icon: ClipboardList, path: "/member/repayments" },
  { label: "Profile", icon: UserCircle, path: "/member/profile" },
];

const treasurerNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/treasurer" },
  { label: "Users", icon: Users, path: "/treasurer/users" },
  { label: "Loans", icon: CreditCard, path: "/treasurer/loans" },
  { label: "Repayments", icon: ClipboardList, path: "/treasurer/repayments" },
  { label: "Reports", icon: BarChart3, path: "/treasurer/reports" },
];

export default function Layout({ children, user, onLogout, role = "admin", activePath }) {
  const navigate = useNavigate();
  const nav = role === "member" ? memberNav : role === "treasurer" ? treasurerNav : adminNav;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", background: "#F0F2F8" }}>

        {/* NAVBAR */}
        <div style={{ background: "linear-gradient(135deg, #0F0C29, #302B63)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
            Fund<span style={{ background: "linear-gradient(135deg, #667EEA, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Flow</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "capitalize" }}>{user?.role}</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #667EEA, #764BA2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff", boxShadow: "0 2px 8px rgba(102,126,234,0.4)" }}>
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        <div style={{ display: "flex" }}>
          {/* SIDEBAR */}
          <div style={{ width: 230, background: "#fff", minHeight: "calc(100vh - 64px)", borderRight: "1px solid #EAECF0", padding: "20px 0", position: "sticky", top: 64 }}>
            <div style={{ padding: "0 16px 8px", fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: 24 }}>Navigation</div>
            {nav.map(item => {
              const Icon = item.icon;
              const isActive = activePath === item.path;
              return (
                <div key={item.label} onClick={() => navigate(item.path)}
                  style={{ margin: "2px 12px", padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", borderRadius: 8, fontSize: 14, fontWeight: isActive ? 600 : 400, color: isActive ? "#667EEA" : "#667085", background: isActive ? "rgba(102,126,234,0.08)" : "transparent", transition: "all 0.15s", borderLeft: isActive ? "3px solid #667EEA" : "3px solid transparent" }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F9FAFB"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                  <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} color={isActive ? "#667EEA" : "#9CA3AF"} />
                  {item.label}
                </div>
              );
            })}
          </div>

          {/* MAIN CONTENT */}
          <div style={{ flex: 1, padding: 32, minWidth: 0 }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
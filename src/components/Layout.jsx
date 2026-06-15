import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, ClipboardList, BarChart3, FileText, UserCircle, LogOut, PiggyBank, Globe } from "lucide-react";
const adminNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Communities", icon: Globe, path: "/admin/communities" },
  { label: "Users", icon: Users, path: "/admin/users" },

];

const memberNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/member" },
  { label: "My Loans", icon: CreditCard, path: "/member/loans" },
  { label: "Apply for Loan", icon: FileText, path: "/member/apply" },
  { label: "Repayments", icon: ClipboardList, path: "/member/repayments" },
  { label: "Contributions", icon: PiggyBank, path: "/member/contributions" },
  { label: "Profile", icon: UserCircle, path: "/member/profile" },
];

const treasurerNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/treasurer" },
  { label: "Members", icon: Users, path: "/treasurer/users" },
  { label: "Loans", icon: CreditCard, path: "/treasurer/loans" },
  { label: "Repayments", icon: ClipboardList, path: "/treasurer/repayments" },
  { label: "Contributions", icon: PiggyBank, path: "/treasurer/contributions" },
  { label: "Reports", icon: BarChart3, path: "/treasurer/reports" },
];

export default function Layout({ children, user, onLogout, role = "admin", activePath }) {
  const navigate = useNavigate();
  const nav = role === "member" ? memberNav : role === "treasurer" ? treasurerNav : adminNav;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", display: "flex" }}>

        {/* SIDEBAR */}
        <div style={{ width: 220, background: "linear-gradient(160deg, #0F2460, #1E3A8A 60%, #2563EB)", minHeight: "100vh", display: "flex", flexDirection: "column", position: "sticky", top: 0, flexShrink: 0, overflow: "hidden" }}>

          {/* Wave pattern overlay */}
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.10, pointerEvents: "none" }} preserveAspectRatio="none">
            <defs>
              <pattern id="sidebarWaves" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
                <path d="M0 45 Q 22.5 22.5, 45 45 T 90 45 T 135 45 T 180 45" stroke="#fff" strokeWidth="1.5" fill="none" />
                <path d="M0 90 Q 22.5 67.5, 45 90 T 90 90 T 135 90 T 180 90" stroke="#fff" strokeWidth="1.5" fill="none" />
                <path d="M0 135 Q 22.5 112.5, 45 135 T 90 135 T 135 135 T 180 135" stroke="#fff" strokeWidth="1.5" fill="none" />
                <path d="M0 0 Q 22.5 -22.5, 45 0 T 90 0 T 135 0 T 180 0" stroke="#fff" strokeWidth="1.5" fill="none" />
                <path d="M0 180 Q 22.5 157.5, 45 180 T 90 180 T 135 180 T 180 180" stroke="#fff" strokeWidth="1.5" fill="none" />
                <path d="M22.5 0 Q 45 22.5, 22.5 45 T 22.5 90 T 22.5 135 T 22.5 180" stroke="#fff" strokeWidth="1" fill="none" opacity="0.6" />
                <path d="M112.5 0 Q 135 22.5, 112.5 45 T 112.5 90 T 112.5 135 T 112.5 180" stroke="#fff" strokeWidth="1" fill="none" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sidebarWaves)" />
          </svg>

          {/* Logo */}
          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
              Fund<span style={{ color: "#93C5FD" }}>Flow</span>
            </div>
          </div>

          {/* Nav items */}
          <div style={{ padding: "12px 0", flex: 1, position: "relative", zIndex: 1 }}>
            {nav.map(item => {
              const Icon = item.icon;
              const isActive = activePath === item.path;
              return (
                <div key={item.label} onClick={() => navigate(item.path)}
                  style={{
                    margin: "1px 10px",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    borderRadius: 7,
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                    background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                    transition: "all 0.12s"
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                  <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} color={isActive ? "#fff" : "rgba(255,255,255,0.45)"} />
                  {item.label}
                </div>
              );
            })}
          </div>

          {/* Logout at bottom */}
          <div style={{ padding: "16px 10px", borderTop: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
            <div onClick={onLogout}
              style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", borderRadius: 7, fontSize: 13, color: "rgba(255,255,255,0.5)", transition: "all 0.12s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
              <LogOut size={15} />
              Logout
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* TOPBAR */}
          <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14, position: "sticky", top: 0, zIndex: 100 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "capitalize" }}>{user?.role}</div>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div style={{ flex: 1, padding: "28px 32px", background: "#F0F2F5", minWidth: 0 }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
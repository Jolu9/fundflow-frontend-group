import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, ClipboardList, BarChart3, FileText, UserCircle, LogOut, PiggyBank, Globe, User, Menu, X } from "lucide-react";

const adminNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Groups", icon: Globe, path: "/admin/groups" },
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

const roleColor = {
  admin: "#7C3AED",
  treasurer: "#2563EB",
  member: "#059669",
};

export default function Layout({ children, user, onLogout, role = "admin", activePath }) {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const nav = role === "member" ? memberNav : role === "treasurer" ? treasurerNav : adminNav;
  const roleTextColor = roleColor[role] ?? "#9CA3AF";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }

        .ff-shell {
          display: grid;
          grid-template-columns: 220px 1fr;
          grid-template-rows: 64px 1fr;
          grid-template-areas: "sidebar topbar" "sidebar content";
          min-height: 100vh;
        }
        .ff-sidebar { grid-area: sidebar; }
        .ff-topbar { grid-area: topbar; }
        .ff-content { grid-area: content; }

        .ff-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #F3F4F6;
          border: 1px solid #E5E7EB;
          color: #374151;
          cursor: pointer;
          margin-right: 4px;
          flex-shrink: 0;
        }
        .ff-brand-mobile { display: none; }
        .ff-sidebar-close { display: none; }
        .ff-overlay { display: none; }

        @media (max-width: 900px) {
          .ff-shell {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
            grid-template-areas: "topbar" "content";
          }

          .ff-menu-btn { display: flex; }
          .ff-brand-mobile {
            display: block;
            font-size: 15px;
            font-weight: 700;
            color: #111827;
            margin-right: auto;
            padding-left: 4px;
          }

          .ff-overlay {
            display: ${navOpen ? "block" : "none"};
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.35);
            z-index: 290;
          }

          .ff-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            width: 240px !important;
            min-height: 100vh !important;
            z-index: 300 !important;
            transform: translateX(${navOpen ? "0" : "-100%"});
            transition: transform 0.22s ease;
            box-shadow: ${navOpen ? "4px 0 24px rgba(0,0,0,0.25)" : "none"};
          }
          .ff-sidebar-header { display: flex !important; align-items: center; justify-content: space-between; }
          .ff-sidebar-close {
            display: flex !important;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            background: rgba(255,255,255,0.1);
            color: #fff;
            cursor: pointer;
            flex-shrink: 0;
          }

          .ff-nav {
            display: flex !important;
            flex-direction: column !important;
            padding: 12px 0 !important;
            gap: 1px !important;
          }
          .ff-nav-item {
            flex-direction: row !important;
            white-space: nowrap !important;
            padding: 10px 14px !important;
            margin: 1px 10px !important;
            gap: 10px !important;
          }
          .ff-nav-label { font-size: 13px !important; }

          .ff-footer {
            border-top: 1px solid rgba(255,255,255,0.08) !important;
            padding: 16px 10px !important;
          }
          .ff-footer-item {
            flex-direction: row !important;
            justify-content: flex-start !important;
            gap: 10px !important;
            padding: 10px 14px !important;
            font-size: 13px !important;
          }

          .ff-topbar {
            position: sticky !important;
            top: 0 !important;
            z-index: 400 !important;
            padding: 0 12px !important;
            height: 56px !important;
            justify-content: flex-start !important;
            gap: 8px !important;
          }
          .ff-topbar-name { display: block !important; text-align: right !important; }
          .ff-topbar-user-name { display: block !important; font-size: 12px !important; }
          .ff-topbar-role { font-size: 10px !important; font-weight: 600 !important; }
          .ff-topbar-divider { display: none !important; }
          .ff-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }

          .ff-content { padding: 16px !important; }
        }

        @media (max-width: 500px) {
          .ff-content { padding: 12px !important; }
          .ff-topbar-user-name { max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        }
      `}</style>

      <div className="ff-shell" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* OVERLAY (mobile only, closes drawer on tap) */}
        <div className="ff-overlay" onClick={() => setNavOpen(false)} />

        {/* TOPBAR */}
        <div className="ff-topbar" style={{ background: "#fff", borderBottom: "1px solid #F3F4F6", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>

          <button className="ff-menu-btn" onClick={() => setNavOpen(v => !v)} aria-label="Toggle navigation">
            {navOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="ff-brand-mobile">
            Fund<span style={{ color: "#2563EB" }}>Flow</span>
          </div>

          <div className="ff-topbar-right" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="ff-topbar-name" style={{ textAlign: "right" }}>
              <div className="ff-topbar-user-name" style={{ fontSize: 13.5, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>
                {user?.name}
              </div>
              <div className="ff-topbar-role" style={{ fontSize: 10.5, color: roleTextColor, textTransform: "capitalize", marginTop: 2, fontWeight: 500 }}>
                {user?.role}
              </div>
            </div>
            <div className="ff-topbar-divider" style={{ width: 1, height: 28, background: "#E5E7EB" }} />
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "#EEF0F3", border: "1px solid #E2E4E8",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0
            }}>
              <User size={20} color="#9CA3AF" strokeWidth={1.8} />
            </div>
          </div>
        </div>

        {/* SIDEBAR / MOBILE DRAWER */}
        <div className="ff-sidebar" style={{ background: "linear-gradient(160deg, #0F2460, #1E3A8A 60%, #2563EB)", display: "flex", flexDirection: "column", position: "sticky", top: 0, overflow: "hidden" }}>

          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.10, pointerEvents: "none" }} preserveAspectRatio="none">
            <defs>
              <pattern id="sidebarWaves" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
                <path d="M0 45 Q 22.5 22.5, 45 45 T 90 45 T 135 45 T 180 45" stroke="#fff" strokeWidth="1.5" fill="none" />
                <path d="M0 90 Q 22.5 67.5, 45 90 T 90 90 T 135 90 T 180 90" stroke="#fff" strokeWidth="1.5" fill="none" />
                <path d="M0 135 Q 22.5 112.5, 45 135 T 90 135 T 135 135 T 180 135" stroke="#fff" strokeWidth="1.5" fill="none" />
                <path d="M22.5 0 Q 45 22.5, 22.5 45 T 22.5 90 T 22.5 135 T 22.5 180" stroke="#fff" strokeWidth="1" fill="none" opacity="0.6" />
                <path d="M112.5 0 Q 135 22.5, 112.5 45 T 112.5 90 T 112.5 135 T 112.5 180" stroke="#fff" strokeWidth="1" fill="none" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sidebarWaves)" />
          </svg>

          <div className="ff-sidebar-header" style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
              Fund<span style={{ color: "#93C5FD" }}>Flow</span>
            </div>
            <div className="ff-sidebar-close" onClick={() => setNavOpen(false)}>
              <X size={16} />
            </div>
          </div>

          <div className="ff-nav" style={{ padding: "12px 0", flex: 1, position: "relative", zIndex: 1 }}>
            {nav.map(item => {
              const Icon = item.icon;
              const isActive = activePath === item.path;
              return (
                <div key={item.label} className="ff-nav-item" onClick={() => { navigate(item.path); setNavOpen(false); }}
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
                  <span className="ff-nav-label">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="ff-footer" style={{ padding: "16px 10px", borderTop: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
            <div className="ff-footer-item" onClick={onLogout}
              style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", borderRadius: 7, fontSize: 13, color: "rgba(255,255,255,0.5)", transition: "all 0.12s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
              <LogOut size={15} />
              Logout
            </div>
          </div>
        </div>

        <div className="ff-content" style={{ padding: "28px 32px", background: "#F0F2F5", minWidth: 0 }}>
          {children}
        </div>
      </div>
    </>
  );
}
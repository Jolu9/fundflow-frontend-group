import { useNavigate } from "react-router-dom";
import { ShieldCheck, Zap, Users, CreditCard, ClipboardList, BarChart3, Shield, UserCheck, Briefcase, User, Check } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const S = {
    body: { fontFamily: "'Poppins', sans-serif", color: "#1A1A2E", background: "#F0F2F8" },
    nav: { background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E5E7EB", padding: "0 80px", height: 66, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
    logo: { fontSize: 22, fontWeight: 800, color: "#1A1A2E" },
    logoSpan: { background: "linear-gradient(135deg, #667EEA, #764BA2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    navLink: { textDecoration: "none", fontSize: 14, color: "#6B7280", fontWeight: 500 },
    btnOutlineNav: { padding: "9px 22px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#374151", background: "#fff", cursor: "pointer", fontFamily: "'Poppins', sans-serif" },
    btnSolidNav: { padding: "9px 22px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, color: "#fff", background: "linear-gradient(135deg, #667EEA, #764BA2)", cursor: "pointer", fontFamily: "'Poppins', sans-serif", boxShadow: "0 4px 14px rgba(102,126,234,0.4)" },
  };

  return (
    <div style={S.body}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.logo}>Fund<span style={S.logoSpan}>Flow</span></div>
        <div style={{ display: "flex", gap: 36 }}>
          {["Home", "Features", "How it works", "About", "Contact"].map(l => (
            <a key={l} href="#" style={S.navLink}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => navigate("/login")} style={S.btnOutlineNav}>Sign in</button>
          <button onClick={() => navigate("/login")} style={S.btnSolidNav}>Get started</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position: "relative", padding: "100px 80px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 60, background: "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)", overflow: "hidden", minHeight: 600 }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1400 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="1400" height="600" fill="url(#grid)"/>
          <circle cx="1200" cy="80" r="180" fill="rgba(102,126,234,0.08)"/>
          <circle cx="1300" cy="500" r="120" fill="rgba(118,75,162,0.08)"/>
          <circle cx="100" cy="400" r="150" fill="rgba(102,126,234,0.05)"/>
        </svg>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 540 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(102,126,234,0.15)", border: "1px solid rgba(102,126,234,0.3)", color: "#A5B4FC", fontSize: 11, fontWeight: 700, padding: "7px 16px", borderRadius: 20, marginBottom: 28, letterSpacing: "0.07em" }}>
            <ShieldCheck size={13} /> CHILIMBA LOAN MANAGEMENT SYSTEM
          </div>
          <h1 style={{ fontSize: 54, fontWeight: 800, color: "#fff", lineHeight: 1.08, marginBottom: 22 }}>
            Managing loans,<br /><span style={{ background: "linear-gradient(135deg, #667EEA, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>made simple.</span>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 40 }}>
            FundFlow brings your Chilimba group into the digital age — track members, issue loans, record repayments, and generate reports all in one secure platform.
          </p>
          <div style={{ display: "flex", gap: 14 }}>
            <button onClick={() => navigate("/login")} style={{ padding: "14px 32px", background: "linear-gradient(135deg, #667EEA, #764BA2)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif", boxShadow: "0 8px 24px rgba(102,126,234,0.4)" }}>Get started →</button>
            <button style={{ padding: "14px 32px", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Learn more</button>
          </div>
        </div>

        {/* PREVIEW CARD */}
        <div style={{ position: "relative", zIndex: 1, width: 440, flexShrink: 0, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: 28, backdropFilter: "blur(20px)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18, display: "flex", justifyContent: "space-between" }}>
            <span><span style={{ display: "inline-block", width: 7, height: 7, background: "#4ADE80", borderRadius: "50%", marginRight: 6, boxShadow: "0 0 6px #4ADE80" }}></span>Dashboard preview</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>LIVE</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
            {[["24","Members"],["11","Active loans"],["K128k","Disbursed"]].map(([n,l]) => (
              <div key={l} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{n}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
          {[
            ["Chanda Mutale","Jun 30, 2026","K5,000","Active","rgba(74,222,128,0.15)","#4ADE80"],
            ["Bwalya Mwansa","May 10, 2026","K3,200","Overdue","rgba(248,113,113,0.15)","#F87171"],
            ["Mutinta Kabwe","Jul 15, 2026","K8,000","Pending","rgba(251,191,36,0.15)","#FBBF24"],
          ].map(([name,due,amt,status,bg,color]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 10, marginBottom: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{name}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Due: {due}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#A5B4FC" }}>{amt}</div>
              <div style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: bg, color }}>{status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #F3F4F6" }}>
        {[["100%","Digital records"],["3","User roles"],["Real-time","Loan tracking"],["Secure","API authentication"]].map(([n,l],i,arr) => (
          <div key={l} style={{ flex: 1, textAlign: "center", padding: "36px 20px", borderRight: i < arr.length-1 ? "1px solid #F3F4F6" : "none" }}>
            <div style={{ fontSize: 30, fontWeight: 800, background: "linear-gradient(135deg, #667EEA, #764BA2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{n}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding: "90px 80px", background: "#F0F2F8" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(102,126,234,0.1)", color: "#667EEA", fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 20, marginBottom: 16, letterSpacing: "0.06em", border: "1px solid rgba(102,126,234,0.2)" }}>
          <Zap size={12} /> HOW IT WORKS
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A2E", marginBottom: 10 }}>Simple, three-step process</h2>
        <p style={{ fontSize: 14, color: "#6B7280", maxWidth: 500, lineHeight: 1.8, marginBottom: 52 }}>From member registration to loan repayment, FundFlow handles everything in a structured and transparent way.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {[
            [Users, "Register members", "Admin or treasurer registers Chilimba members with their personal details, national ID, and contact information."],
            [CreditCard, "Issue & approve loans", "Members apply for loans. The treasurer reviews applications, sets interest rates and due dates, then approves or rejects."],
            [BarChart3, "Track repayments", "Record repayments as members pay back. The system tracks outstanding balances and flags overdue loans automatically."],
          ].map(([Icon, title, desc], i) => (
            <div key={title} style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", border: "1px solid #E5E7EB", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(135deg, #667EEA, #764BA2)" }}></div>
              <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, #667EEA, #764BA2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 4px 14px rgba(102,126,234,0.35)" }}>
                <Icon size={20} color="#fff" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A2E", marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.75 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: "90px 80px", background: "#fff" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(102,126,234,0.1)", color: "#667EEA", fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 20, marginBottom: 16, letterSpacing: "0.06em", border: "1px solid rgba(102,126,234,0.2)" }}>
          <Zap size={12} /> FEATURES
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A2E", marginBottom: 10 }}>Everything you need</h2>
        <p style={{ fontSize: 14, color: "#6B7280", maxWidth: 500, lineHeight: 1.8, marginBottom: 52 }}>Built specifically for Chilimba group loan management with all the features your group needs.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
          {[
            [Users, "Member management", "Register members with full profiles — name, email, phone, national ID, and address all in one record."],
            [CreditCard, "Loan issuance", "Issue loans with configurable amounts, interest rates, and due dates. Full loan history per member."],
            [ClipboardList, "Repayment tracking", "Record repayments and track remaining balances. Overdue loans are automatically flagged."],
            [BarChart3, "Reports & exports", "Generate financial summaries and export loan reports for your group's records and audits."],
            [Shield, "Role-based access", "Three distinct roles — Admin, Treasurer, and Member — each with appropriate access levels."],
            [Zap, "Real-time dashboard", "Live stats on active loans, overdue accounts, total disbursed funds, and member count."],
          ].map(([Icon, title, desc]) => (
            <div key={title} style={{ background: "#F8F9FF", borderRadius: 16, padding: 30, border: "1px solid #E5E7EB" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #667EEA, #764BA2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: "0 4px 14px rgba(102,126,234,0.3)" }}>
                <Icon size={22} color="#fff" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ROLES */}
      <div style={{ padding: "90px 80px", background: "#F0F2F8" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(102,126,234,0.1)", color: "#667EEA", fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 20, marginBottom: 16, letterSpacing: "0.06em", border: "1px solid rgba(102,126,234,0.2)" }}>
          <UserCheck size={12} /> USER ROLES
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A2E", marginBottom: 10 }}>Built for every stakeholder</h2>
        <p style={{ fontSize: 14, color: "#6B7280", maxWidth: 500, lineHeight: 1.8, marginBottom: 52 }}>FundFlow gives each user exactly what they need — no more, no less.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
          {[
            { badge: "ADMIN", BadgeIcon: ShieldCheck, badgeBg: "linear-gradient(135deg,#667EEA,#764BA2)", badgeColor: "#fff", title: "Administrator", highlight: true, checkColor: "#A5B4FC", items: ["Create and manage user accounts","Assign roles to users","View all loans and members","Access full dashboard stats","View activity logs"] },
            { badge: "TREASURER", BadgeIcon: Briefcase, badgeBg: "rgba(102,126,234,0.1)", badgeColor: "#667EEA", title: "Treasurer", highlight: false, checkColor: "#667EEA", items: ["Register new members","Issue and approve loans","Record repayments","Generate financial reports","Monitor overdue loans"] },
            { badge: "MEMBER", BadgeIcon: User, badgeBg: "#F3F4F6", badgeColor: "#6B7280", title: "Member", highlight: false, checkColor: "#9CA3AF", items: ["Apply for a loan","View loan status","Check outstanding balance","View repayment history","Update personal profile"] },
          ].map(({ badge, BadgeIcon, badgeBg, badgeColor, title, highlight, checkColor, items }) => (
            <div key={title} style={{ background: highlight ? "linear-gradient(135deg,#0F0C29,#302B63)" : "#fff", borderRadius: 16, padding: "32px 28px", border: highlight ? "none" : "1px solid #E5E7EB" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, padding: "5px 12px", borderRadius: 20, marginBottom: 14, letterSpacing: "0.06em", background: badgeBg, color: badgeColor }}>
                <BadgeIcon size={11} /> {badge}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: highlight ? "#fff" : "#1A1A2E" }}>{title}</h3>
              <ul style={{ listStyle: "none" }}>
                {items.map(item => (
                  <li key={item} style={{ fontSize: 13, padding: "8px 0", borderBottom: `1px solid ${highlight ? "rgba(255,255,255,0.08)" : "#F3F4F6"}`, display: "flex", alignItems: "center", gap: 10, color: highlight ? "rgba(255,255,255,0.7)" : "#6B7280" }}>
                    <Check size={14} color={checkColor} strokeWidth={2.5} style={{ flexShrink: 0 }} /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: "relative", padding: "100px 80px", textAlign: "center", background: "linear-gradient(135deg,#0F0C29 0%,#302B63 50%,#24243E 100%)", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1400 400" preserveAspectRatio="xMidYMid slice">
          <defs><pattern id="grid2" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/></pattern></defs>
          <rect width="1400" height="400" fill="url(#grid2)"/>
          <circle cx="200" cy="200" r="300" fill="rgba(102,126,234,0.1)"/>
          <circle cx="1200" cy="200" r="300" fill="rgba(118,75,162,0.1)"/>
        </svg>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: "#fff", marginBottom: 14 }}>Ready to get started?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", marginBottom: 36 }}>Sign in to your FundFlow account and start managing your Chilimba group today.</p>
          <button onClick={() => navigate("/login")} style={{ padding: "16px 48px", background: "linear-gradient(135deg,#667EEA,#764BA2)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "'Poppins', sans-serif", boxShadow: "0 8px 28px rgba(102,126,234,0.5)" }}>Sign in to FundFlow →</button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: "#0D0D1A", padding: "36px 80px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Fund<span style={S.logoSpan}>Flow</span></div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>© 2026 FundFlow. All rights reserved.</div>
      </div>
    </div>
  );
}
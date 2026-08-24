import { useNavigate } from "react-router-dom";
import { Users, CreditCard, BarChart3, Shield, ArrowRight, CheckCircle, TrendingUp, PiggyBank, Bell } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", color: "#111827", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 80px", height: 64, borderBottom: "1px solid #F3F4F6", position: "sticky", top: 0, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(8px)", zIndex: 100 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#1E3A8A", letterSpacing: "-0.02em" }}>
          Fund<span style={{ color: "#2563EB" }}>Flow</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", fontFamily: "inherit", padding: "8px 16px" }}>
            Log in
          </button>
          <button onClick={() => navigate("/register")} style={{ padding: "9px 22px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
            Get started <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center top", padding: "110px 80px 120px" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(155deg, rgba(8,18,70,0.94), rgba(20,60,170,0.86))" }} />
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.05, pointerEvents: "none" }} preserveAspectRatio="none">
          <defs>
            <pattern id="waves" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">
              <path d="M0 60 Q 30 30, 60 60 T 120 60 T 180 60 T 240 60" stroke="#fff" strokeWidth="1.5" fill="none" />
              <path d="M0 120 Q 30 90, 60 120 T 120 120 T 180 120 T 240 120" stroke="#fff" strokeWidth="1.5" fill="none" />
              <path d="M0 180 Q 30 150, 60 180 T 120 180 T 180 180 T 240 180" stroke="#fff" strokeWidth="1.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 660, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: 50, fontWeight: 700, color: "#fff", marginBottom: 20, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
            Manage your savings group<br />
            <span style={{ color: "#93C5FD" }}>without the paperwork</span>
          </h1>

          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", marginBottom: 44, lineHeight: 1.85, maxWidth: 520, margin: "0 auto 44px" }}>
            FundFlow is a web-based loan and savings management platform for informal groups. Members track their loans and contributions, treasurers manage the group finances, and everyone stays on the same page.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 64 }}>
            <button onClick={() => navigate("/register")}
              style={{ padding: "13px 30px", background: "#fff", color: "#1E3A8A", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(0,0,0,0.22)", display: "flex", alignItems: "center", gap: 8 }}>
              Get started <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate("/login")}
              style={{ padding: "13px 26px", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              Sign in
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 40 }}>
            {[
              ["Contributions", "Track every member's savings in real time"],
              ["Loans", "Issue and monitor loans with full repayment history"],
              ["Reports", "Export clean PDF summaries for your records"],
            ].map(([label, sub], i) => (
              <div key={label} style={{ textAlign: "center", padding: "0 28px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "96px 80px", background: "#F8FAFF" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>How it works</p>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em", marginBottom: 14 }}>Up and running in minutes</h2>
          <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 440, margin: "0 auto", lineHeight: 1.8 }}>
            No complicated setup. Create your group, invite your members, and start tracking everything straight away.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ position: "absolute", top: 40, left: "17%", right: "17%", height: 1, background: "linear-gradient(90deg, #BFDBFE, #2563EB, #BFDBFE)", zIndex: 0 }} />
          {[
            { step: "01", title: "Create your group", desc: "A treasurer registers and sets up the group in seconds, with full control over loans, contributions, and members.", color: "#2563EB", bg: "#EFF6FF", border: "#DBEAFE" },
            { step: "02", title: "Invite your members", desc: "Members join using a unique invite code. Each person gets their own account with access to their personal loan and repayment history.", color: "#7C3AED", bg: "#F5F3FF", border: "#EDE9FE" },
            { step: "03", title: "Manage everything", desc: "Approve loans, record repayments, track contributions, and export financial reports, all from a single dashboard.", color: "#059669", bg: "#F0FDF4", border: "#D1FAE5" },
          ].map(({ step, title, desc, color, bg, border }) => (
            <div key={step} style={{ background: "#fff", borderRadius: 16, padding: "34px 26px", border: `1px solid ${border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", position: "relative", zIndex: 1, textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: bg, border: `2px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 15, fontWeight: 700, color }}>
                {step}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.8, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "96px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Features</p>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em", marginBottom: 14 }}>Everything your group needs</h2>
          <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 440, margin: "0 auto", lineHeight: 1.8 }}>
            Purpose-built for how informal savings and lending groups actually operate.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, maxWidth: 980, margin: "0 auto" }}>
          {[
            [BarChart3, "Loan Management", "Issue loans with interest rates, due dates, and principal amounts. The system tracks every record automatically.", "#2563EB", "#EFF6FF", "#DBEAFE"],
            [CreditCard, "Repayment Tracking", "Record repayments, monitor outstanding balances, and automatically flag overdue accounts.", "#7C3AED", "#F5F3FF", "#EDE9FE"],
            [PiggyBank, "Contribution Tracking", "Log member savings contributions and see who has paid and who has not at a glance.", "#059669", "#F0FDF4", "#D1FAE5"],
            [Bell, "Notifications", "Treasurers are alerted to pending loan applications, contribution requests, and repayments awaiting confirmation.", "#0891B2", "#ECFEFF", "#A5F3FC"],
            [Shield, "Role-based Access", "Administrator, Treasurer, and Member roles each have exactly the right level of access and nothing more.", "#DC2626", "#FEF2F2", "#FECACA"],
            [TrendingUp, "Reports and Export", "Generate PDF financial summaries covering all loans and contributions for group record keeping.", "#D97706", "#FFFBEB", "#FDE68A"],
          ].map(([Icon, title, desc, color, bg, border]) => (
            <div key={title}
              style={{ padding: "28px 24px", border: `1px solid ${border}`, borderRadius: 14, background: "#fff", transition: "box-shadow 0.2s, transform 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ width: 44, height: 44, background: bg, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.8, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY FUNDFLOW */}
      <section style={{ padding: "0 80px 96px" }}>
        <div style={{ background: "linear-gradient(140deg, #0A1550, #1E3A8A 55%, #1d4ed8)", borderRadius: 20, padding: "72px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center", position: "relative", overflow: "hidden" }}>
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none" }} preserveAspectRatio="none">
            <defs>
              <pattern id="wavesBg" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q 25 25, 50 50 T 100 50 T 150 50 T 200 50" stroke="#fff" strokeWidth="1" fill="none" />
                <path d="M0 100 Q 25 75, 50 100 T 100 100 T 150 100 T 200 100" stroke="#fff" strokeWidth="1" fill="none" />
                <path d="M0 150 Q 25 125, 50 150 T 100 150 T 150 150 T 200 150" stroke="#fff" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wavesBg)" />
          </svg>
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#93C5FD", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Why FundFlow</p>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
              Replacing notebooks with something that actually works
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, marginBottom: 32 }}>
              Most savings groups rely on notebooks, spreadsheets, and memory to manage their finances. FundFlow puts everything in one place so records stay accurate, members stay informed, and nothing gets lost.
            </p>
            <button onClick={() => navigate("/register")}
              style={{ padding: "11px 26px", background: "#fff", color: "#1E3A8A", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Get started free <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 1 }}>
            {[
              "No spreadsheets or notebooks required",
              "Every member can see their own loan and repayment history",
              "The treasurer controls who gets loans and when",
              "Overdue loans are flagged automatically",
              "Real-time dashboard for the treasurer and members",
              "Clean PDF reports ready for any group meeting",
              "Accessible from any device with a browser",
            ].map(point => (
              <div key={point} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(147,197,253,0.12)", border: "1px solid rgba(147,197,253,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <CheckCircle size={12} color="#93C5FD" />
                </div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{point}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ margin: "0 80px 88px" }}>
        <div style={{ background: "#F0F5FF", border: "1px solid #DBEAFE", borderRadius: 18, padding: "64px 80px", textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 14, letterSpacing: "-0.01em" }}>Ready to bring your group online?</h2>
          <p style={{ fontSize: 15, color: "#6B7280", marginBottom: 36, lineHeight: 1.8, maxWidth: 420, margin: "0 auto 36px" }}>
            Start a new savings group or join an existing one with an invite code from your treasurer.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => navigate("/register")}
              style={{ padding: "12px 30px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
              Get started <ArrowRight size={14} />
            </button>
            <button onClick={() => navigate("/login")}
              style={{ padding: "12px 28px", background: "#fff", color: "#1E3A8A", border: "1px solid #BFDBFE", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              Sign in
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #F3F4F6", padding: "24px 80px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1E3A8A", letterSpacing: "-0.02em" }}>
          Fund<span style={{ color: "#2563EB" }}>Flow</span>
        </div>
        <div style={{ fontSize: 12, color: "#9CA3AF" }}>© 2026 FundFlow. Loan and savings management for informal groups.</div>
      </footer>
    </div>
  );
}
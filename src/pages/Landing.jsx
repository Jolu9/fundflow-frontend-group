import { useNavigate } from "react-router-dom";
import { Users, CreditCard, BarChart3, Shield, Zap, ClipboardList, ArrowRight, CheckCircle } from "lucide-react";

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
          <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", fontFamily: "inherit", padding: "8px 16px" }}>Log in</button>
          <button onClick={() => navigate("/register")} style={{ padding: "9px 22px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
            Get started <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center", padding: "80px 80px 90px" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(10,25,80,0.92), rgba(20,70,180,0.82))" }} />

        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.06 }} preserveAspectRatio="none">
          <defs>
            <pattern id="waves" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">
              <path d="M0 60 Q 30 30, 60 60 T 120 60 T 180 60 T 240 60" stroke="#fff" strokeWidth="1.5" fill="none" />
              <path d="M0 120 Q 30 90, 60 120 T 120 120 T 180 120 T 240 120" stroke="#fff" strokeWidth="1.5" fill="none" />
              <path d="M0 180 Q 30 150, 60 180 T 120 180 T 180 180 T 240 180" stroke="#fff" strokeWidth="1.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "6px 16px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 28, letterSpacing: "0.07em", textTransform: "uppercase" }}>
            ✦ Built for Chilimba Groups in Zambia
          </div>

          <h1 style={{ fontSize: 46, fontWeight: 700, color: "#fff", marginBottom: 18, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            Your Savings Group,<br />
            <span style={{ color: "#93C5FD" }}>Finally Organized</span>
          </h1>

          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", marginBottom: 40, lineHeight: 1.8, maxWidth: 500, margin: "0 auto 40px" }}>
            FundFlow brings your Chilimba group online — track contributions, manage loans, and give every member full visibility into the group's finances.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 48 }}>
            <button onClick={() => navigate("/register")}
              style={{ padding: "12px 30px", background: "#fff", color: "#1E3A8A", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 24px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
              Start for free <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate("/login")}
              style={{ padding: "12px 26px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              Sign in
            </button>
          </div>

          <div style={{ display: "flex", gap: 0, justifyContent: "center", borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 36 }}>
            {[
              ["Contributions", "Track every member's savings in real time"],
              ["Loans", "Issue and monitor with ease"],
              ["Repayments", "Full payment history, always up to date"],
            ].map(([label, sub], i) => (
              <div key={label} style={{ textAlign: "center", padding: "0 36px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 5 }}>{label}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "88px 80px", background: "#F8FAFF" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>How it works</p>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em", marginBottom: 12 }}>Up and running in minutes</h2>
          <p style={{ fontSize: 14, color: "#6B7280", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
            No complicated setup. Create your group, invite your members, and start tracking everything immediately.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 880, margin: "0 auto", position: "relative" }}>
          <div style={{ position: "absolute", top: 36, left: "16.5%", right: "16.5%", height: 1, background: "linear-gradient(90deg, #BFDBFE, #2563EB, #BFDBFE)", zIndex: 0 }} />

          {[
            { step: "01", title: "Create your group", desc: "Register and set up your Chilimba group in seconds. You automatically become the treasurer with full control.", color: "#2563EB", bg: "#EFF6FF" },
            { step: "02", title: "Invite your members", desc: "Share a unique invite code with your group members. They join instantly and get their own member accounts.", color: "#7C3AED", bg: "#F5F3FF" },
            { step: "03", title: "Manage everything", desc: "Track contributions, approve loan requests, record repayments, and export reports — all from one dashboard.", color: "#059669", bg: "#F0FDF4" },
          ].map(({ step, title, desc, color, bg }) => (
            <div key={step} style={{ background: "#fff", borderRadius: 14, padding: "30px 26px", border: "1px solid #E8EAED", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", position: "relative", zIndex: 1, textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 15, fontWeight: 700, color }}>
                {step}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "88px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Features</p>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>Everything your group needs</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            [BarChart3, "Loan Origination", "Apply and issue loans with interest rates, due dates, and full member tracking.", "#2563EB", "#EFF6FF"],
            [CreditCard, "Loan Servicing", "Record repayments, monitor balances, and automatically flag overdue accounts.", "#7C3AED", "#F5F3FF"],
            [Users, "Member Management", "Manage your group members, roles, and complete loan history all in one place.", "#059669", "#F0FDF4"],
            [ClipboardList, "Repayment Tracking", "Track every payment made, view outstanding balances and loan completion status.", "#D97706", "#FFFBEB"],
            [Shield, "Role-based Access", "Admin, Treasurer, and Member roles each with the right level of access.", "#DC2626", "#FEF2F2"],
            [Zap, "Real-time Dashboard", "Live stats on active loans, overdue accounts, and total disbursed funds.", "#0891B2", "#ECFEFF"],
          ].map(([Icon, title, desc, color, bg]) => (
            <div key={title} style={{ padding: "26px 22px", border: "1px solid #E8EAED", borderRadius: 14, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", transition: "box-shadow 0.2s, transform 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ width: 42, height: 42, background: bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY FUNDFLOW */}
      <section style={{ padding: "0 80px 88px" }}>
        <div style={{ background: "linear-gradient(135deg, #0F2460, #1E3A8A)", borderRadius: 18, padding: "60px 72px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#93C5FD", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Why FundFlow</p>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 14, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
              Built specifically for<br />African savings groups
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 28 }}>
              Chilimba groups have been running on notebooks and trust for decades. FundFlow brings that same simplicity online — so nothing falls through the cracks.
            </p>
            <button onClick={() => navigate("/register")}
              style={{ padding: "11px 26px", background: "#fff", color: "#1E3A8A", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Get started free →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              "No spreadsheets or notebooks needed",
              "Every member sees their own loan and contribution history",
              "Treasurer controls who gets loans and when",
              "Overdue loans are flagged automatically",
              "Export reports for record keeping",
              "Works on any device with a browser",
            ].map(point => (
              <div key={point} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <CheckCircle size={12} color="#93C5FD" />
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{point}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ margin: "0 80px 80px", padding: "60px 80px", background: "#F8FAFF", border: "1px solid #E0EAFF", borderRadius: 16, textAlign: "center" }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginBottom: 12, letterSpacing: "-0.01em" }}>Ready to bring your group online?</h2>
        <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28, lineHeight: 1.7 }}>Create your savings group today or join one with an invite code.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => navigate("/register")}
            style={{ padding: "11px 30px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
            Create a group <ArrowRight size={14} />
          </button>
          <button onClick={() => navigate("/login")}
            style={{ padding: "11px 28px", background: "#fff", color: "#1E3A8A", border: "1px solid #BFDBFE", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            Sign in
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #F3F4F6", padding: "24px 80px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1E3A8A", letterSpacing: "-0.02em" }}>
          Fund<span style={{ color: "#2563EB" }}>Flow</span>
        </div>
        <div style={{ fontSize: 12, color: "#9CA3AF" }}>© 2026 FundFlow. Built for Zambian savings groups.</div>
      </footer>
    </div>
  );
}
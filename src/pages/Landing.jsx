import { useNavigate } from "react-router-dom";
import { Users, CreditCard, BarChart3, Shield, Zap, ClipboardList } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", color: "#111827", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 80px", height: 60, borderBottom: "1px solid #F3F4F6", position: "sticky", top: 0, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", zIndex: 100 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1E3A8A" }}>
          Fund<span style={{ color: "#2563EB" }}>Flow</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>Log in</button>
          <button onClick={() => navigate("/register")} style={{ padding: "8px 20px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Get started</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "72px 24px", backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center top", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(10,25,80,0.93), rgba(20,70,180,0.80))" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 620, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 999, padding: "5px 16px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 28, letterSpacing: "0.07em", textTransform: "uppercase" }}>
            Built for Chilimba Groups
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 700, color: "#fff", marginBottom: 18, lineHeight: 1.18, letterSpacing: "-0.02em" }}>
            Manage Your Group's<br />Savings and Loans Simply
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.68)", marginBottom: 38, lineHeight: 1.75 }}>
            FundFlow gives Chilimba groups a single platform to track contributions, approve loans, and monitor repayments with full transparency for every member.
          </p>
          <button onClick={() => navigate("/register")} style={{ padding: "12px 32px", background: "#fff", color: "#1E3A8A", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
            Get started for free →
          </button>
          <div style={{ display: "flex", gap: 28, justifyContent: "center", marginTop: 40 }}>
            {[["Contributions", "Track every member's savings"], ["Loans", "Issue and monitor with ease"], ["Repayments", "Full payment history"]].map(([label, sub]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "80px 80px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#2563EB", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Features</p>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>Everything your group needs</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            [BarChart3, "Loan Origination", "Apply and issue loans with interest rates, due dates, and full member tracking."],
            [CreditCard, "Loan Servicing", "Record repayments, monitor balances, and automatically flag overdue accounts."],
            [Users, "Member Management", "Manage your group members, roles, and complete loan history all in one place."],
            [ClipboardList, "Repayment Tracking", "Track every payment made, view outstanding balances and loan completion status."],
            [Shield, "Role-based Access", "Admin, Treasurer, and Member roles each with the right level of access."],
            [Zap, "Real-time Dashboard", "Live stats on active loans, overdue accounts, and total disbursed funds."],
          ].map(([Icon, title, desc]) => (
            <div key={title} style={{ padding: "28px 24px", border: "1px solid #E8EAED", borderRadius: 14, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "box-shadow 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"}>
              <div style={{ width: 42, height: 42, background: "#EFF6FF", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon size={20} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ margin: "80px 80px", padding: "56px 80px", background: "#F8FAFF", border: "1px solid #E0EAFF", borderRadius: 16, textAlign: "center" }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginBottom: 10, letterSpacing: "-0.01em" }}>Ready to get started?</h2>
        <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28 }}>Create your savings group today or join one with an invite code.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => navigate("/register")} style={{ padding: "11px 32px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Create a group →
          </button>
          <button onClick={() => navigate("/login")} style={{ padding: "11px 32px", background: "#fff", color: "#1E3A8A", border: "1px solid #E0EAFF", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Sign in
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #F3F4F6", padding: "24px 80px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1E3A8A" }}>Fund<span style={{ color: "#2563EB" }}>Flow</span></div>
        <div style={{ fontSize: 12, color: "#9CA3AF" }}>© 2026 FundFlow. All rights reserved.</div>
      </footer>
    </div>
  );
}
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      const role = res.data.role;
      if (role === "admin") navigate("/admin");
      else if (role === "treasurer") navigate("/treasurer");
      else navigate("/member");
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0F2460, #1E3A8A, #2563EB)", position: "relative", overflow: "hidden" }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.12 }} preserveAspectRatio="none">
          <defs>
            <pattern id="waves" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">
              <path d="M0 60 Q 30 30, 60 60 T 120 60 T 180 60 T 240 60" stroke="#fff" strokeWidth="1.5" fill="none" />
              <path d="M0 120 Q 30 90, 60 120 T 120 120 T 180 120 T 240 120" stroke="#fff" strokeWidth="1.5" fill="none" />
              <path d="M0 180 Q 30 150, 60 180 T 120 180 T 180 180 T 240 180" stroke="#fff" strokeWidth="1.5" fill="none" />
              <path d="M0 0 Q 30 -30, 60 0 T 120 0 T 180 0 T 240 0" stroke="#fff" strokeWidth="1.5" fill="none" />
              <path d="M0 240 Q 30 210, 60 240 T 120 240 T 180 240 T 240 240" stroke="#fff" strokeWidth="1.5" fill="none" />
              <path d="M30 0 Q 60 30, 30 60 T 30 120 T 30 180 T 30 240" stroke="#fff" strokeWidth="1" fill="none" opacity="0.6" />
              <path d="M150 0 Q 180 30, 150 60 T 150 120 T 150 180 T 150 240" stroke="#fff" strokeWidth="1" fill="none" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>

        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.05)", top: -100, right: -100 }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)", bottom: -80, left: -80 }} />

        <div style={{ position: "relative", zIndex: 1, width: 440 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "44px 40px", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
            <div style={{ marginBottom: 32 }}>
              <div onClick={() => navigate("/")} style={{ fontSize: 20, fontWeight: 700, color: "#1E3A8A", marginBottom: 8, cursor: "pointer" }}>
                Fund<span style={{ color: "#2563EB" }}>Flow</span>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Sign in to your account</h1>
              <p style={{ fontSize: 13, color: "#9CA3AF" }}>Enter your credentials to continue</p>
            </div>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "11px 14px", borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email address</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                  style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#F9FAFB", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
                  onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required
                  style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#F9FAFB", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.border = "1.5px solid #2563EB"}
                  onBlur={e => e.target.style.border = "1.5px solid #E5E7EB"} />
              </div>
              <button type="submit" style={{ width: "100%", padding: "12px", background: "#1E3A8A", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Sign in →
              </button>
            </form>

            <div style={{ marginTop: 20, background: "#F8FAFF", border: "1px solid #E0EAFF", borderRadius: 8, padding: "11px 14px", fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>
              <strong style={{ display: "block", color: "#1E3A8A", marginBottom: 3 }}>Who can sign in?</strong>
              Admin, Treasurer, and Member accounts. New? Create an account below.
            </div>

            <div style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: "#9CA3AF" }}>
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")} style={{ color: "#2563EB", fontWeight: 600, cursor: "pointer" }}>Sign up</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
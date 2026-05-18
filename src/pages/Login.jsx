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
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", background: "#F4F6FB", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "48px 44px", width: "100%", maxWidth: 420, boxShadow: "0 4px 32px rgba(0,0,0,0.08)" }}>
          
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#0D1B5E", marginBottom: 6 }}>
              Fund<span style={{ color: "#1976D2" }}>Flow</span>
            </div>
            <p style={{ fontSize: 13, color: "#999", margin: 0 }}>Sign in to your account</p>
          </div>

          {error && (
            <div style={{ background: "#FFF0F0", border: "1px solid #FFCDD2", color: "#C62828", padding: "12px 16px", borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 7 }}>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 14, fontFamily: "'Poppins', sans-serif", outline: "none", background: "#fafafa", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 7 }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 14, fontFamily: "'Poppins', sans-serif", outline: "none", background: "#fafafa", boxSizing: "border-box" }}
              />
            </div>
            <button
              type="submit"
              style={{ width: "100%", padding: 13, background: "#0D1B5E", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}
            >
              Sign in
            </button>
          </form>

          <div style={{ marginTop: 24, background: "#F0F4FF", borderRadius: 8, padding: "12px 14px", fontSize: 12, color: "#5C6BC0", lineHeight: 1.6 }}>
            <strong style={{ display: "block", color: "#0D1B5E", marginBottom: 3, fontSize: 12 }}>Who can sign in?</strong>
            Admin · Treasurer · Member — accounts are created by your administrator.
          </div>
        </div>
      </div>
    </>
  );
}
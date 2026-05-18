import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

export default function TreasurerRepayments() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [form, setForm] = useState({ loan_id: "", amount: "", notes: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchRepayments = () => {
    axios.get(`${API}/repayments`, { headers }).then(res => setRepayments(res.data)).catch(() => {});
  };

  useEffect(() => {
    if (!token) { 
      navigate("/login"); 
      return; 
    }
    
    axios.get(`${API}/me`, { headers })
      .then(res => setUser(res.data))
      .catch(() => { 
        localStorage.clear(); 
        navigate("/login"); 
      });
    
    // Fetch active loans
    axios.get(`${API}/loans`, { headers })
      .then(res => {
        const activeLoans = res.data.filter(l => l.status === "active");
        setLoans(activeLoans);
        
        // Preselect loan from URL param
        const loanId = searchParams.get("loan");
        if (loanId) {
          setForm(f => ({ ...f, loan_id: loanId }));
        }
      })
      .catch(err => console.error("Failed to fetch loans:", err));
    
    fetchRepayments();
  }, []);

  const handleSubmit = async () => {
    if (!form.loan_id || !form.amount) { 
      setError("Loan and amount are required."); 
      return; 
    }
    
    setLoading(true); 
    setError(""); 
    setSuccess("");
    
    try {
      await axios.post(`${API}/repayments`, {
        loan_id: parseInt(form.loan_id),
        amount: parseFloat(form.amount),
        notes: form.notes || null
      }, { headers });
      
      setSuccess("Repayment recorded successfully.");
      setForm({ loan_id: "", amount: "", notes: "" });
      fetchRepayments();
      
      // Refresh loans list
      axios.get(`${API}/loans`, { headers }).then(res => {
        const activeLoans = res.data.filter(l => l.status === "active");
        setLoans(activeLoans);
      });
      
    } catch (e) {
      setError(e.response?.data?.message || "Failed to record repayment.");
    }
    setLoading(false);
  };

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { 
      localStorage.clear(); 
      navigate("/login"); 
    });
  };

  return (
    <Layout user={user} onLogout={logout} role="treasurer" activePath="/treasurer/repayments">
      <div style={{ background: "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)", borderRadius: 16, padding: "32px 36px", marginBottom: 28 }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Treasurer Panel</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Record Repayment</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Log a member's loan repayment</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* FORM */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 28, border: "1px solid #EAECF0" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F0C29", marginBottom: 20 }}>New repayment</h3>
          {error && <div style={{ background: "#FFF0F0", border: "1px solid #FFCDD2", color: "#C62828", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
          {success && <div style={{ background: "#F0FFF4", border: "1px solid #C6F6D5", color: "#276749", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{success}</div>}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Select Loan</label>
            <select 
              value={form.loan_id} 
              onChange={e => setForm({ ...form, loan_id: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", outline: "none" }}
            >
              <option value="">Select active loan</option>
              {loans.map(l => {
                const remaining = (l.total_due || l.amount) - (l.amount_paid || 0);
                return (
                  <option key={l.id} value={l.id}>
                    {l.user?.name || "Unknown"} — K{Number(l.amount).toLocaleString()} (Remaining: K{remaining.toLocaleString()})
                  </option>
                );
              })}
            </select>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Amount Paid (K)</label>
            <input 
              type="number" 
              value={form.amount} 
              onChange={e => setForm({ ...form, amount: e.target.value })}
              placeholder="e.g. 500"
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box" }} 
            />
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Notes (optional)</label>
            <input 
              type="text" 
              value={form.notes} 
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="e.g. Cash payment"
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box" }} 
            />
          </div>
          
          <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg, #667EEA, #764BA2)", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif", boxShadow: "0 4px 14px rgba(102,126,234,0.35)" }}>
            {loading ? "Recording..." : "Record Repayment"}
          </button>
        </div>

        {/* HISTORY */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EAECF0", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #EAECF0" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F0C29" }}>Recent repayments</h3>
          </div>
          <div style={{ maxHeight: 400, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#667085" }}>Member</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#667085" }}>Amount</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#667085" }}>Date</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#667085" }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {repayments.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: 32, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No repayments yet.</td>
                  </tr>
                ) : (
                  repayments.map(r => (
                    <tr key={r.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#0F0C29" }}>{r.loan?.user?.name ?? "—"}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#16A34A" }}>K{Number(r.amount).toLocaleString()}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#9CA3AF" }}>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#667085" }}>{r.notes || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
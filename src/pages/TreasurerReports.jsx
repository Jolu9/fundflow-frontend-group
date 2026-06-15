import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

export default function TreasurerReports() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    axios.get(`${API}/loans`, { headers }).then(res => setLoans(res.data)).catch(() => {});
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const totalDisbursed = loans.reduce((sum, l) => sum + Number(l.amount), 0);
  const totalRepaid = loans.reduce((sum, l) => sum + Number(l.amount_paid), 0);
  const totalRemaining = loans.reduce((sum, l) => sum + (Number(l.total_due) - Number(l.amount_paid)), 0);
  const activeCount = loans.filter(l => l.status === "active").length;
  const overdueCount = loans.filter(l => l.status === "overdue").length;
  const completedCount = loans.filter(l => l.status === "completed").length;

  return (
    <Layout user={user} onLogout={logout} role="treasurer" activePath="/treasurer/reports">

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Reports</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>Summary statistics and export.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Disbursed", value: `K${totalDisbursed.toLocaleString()}`, color: "#2563EB" },
          { label: "Total Repaid", value: `K${totalRepaid.toLocaleString()}`, color: "#059669" },
          { label: "Outstanding", value: `K${totalRemaining.toLocaleString()}`, color: "#D97706" },
          { label: "Active Loans", value: activeCount, color: "#7C3AED" },
          { label: "Overdue Loans", value: overdueCount, color: "#DC2626" },
          { label: "Completed Loans", value: completedCount, color: "#6B7280" },
        ].map(card => (
          <div key={card.label} style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", border: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#9CA3AF", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>{card.label}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#111827" }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 10, padding: 32, border: "1px solid #E5E7EB", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 8 }}>Export Loan Data</h3>
        <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 24 }}>Download all loan records as a CSV file. Opens in Excel or Google Sheets.</p>
        <button onClick={() => window.open(`${API}/export/loans`, '_blank')}
          style={{ padding: "10px 28px", background: "#059669", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          ⬇ Export to CSV
        </button>
      </div>
    </Layout>
  );
}
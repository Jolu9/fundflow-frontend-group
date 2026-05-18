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

  const handleExport = () => {
    window.open(`${API}/export/loans`, '_blank');
  };

  const totalDisbursed = loans.reduce((sum, l) => sum + Number(l.amount), 0);
  const totalRepaid    = loans.reduce((sum, l) => sum + Number(l.amount_paid), 0);
  const totalRemaining = loans.reduce((sum, l) => sum + (Number(l.total_due) - Number(l.amount_paid)), 0);
  const activeCount    = loans.filter(l => l.status === "active").length;
  const overdueCount   = loans.filter(l => l.status === "overdue").length;
  const completedCount = loans.filter(l => l.status === "completed").length;

  return (
    <Layout user={user} onLogout={logout} role="treasurer" activePath="/treasurer/reports">
      <div style={{ background: "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)", borderRadius: 16, padding: "32px 36px", marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Reports</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Summary statistics and export</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 28 }}>
        {[
          { label: "Total Disbursed",  value: `K${totalDisbursed.toLocaleString()}`,  color: "#3B82F6" },
          { label: "Total Repaid",     value: `K${totalRepaid.toLocaleString()}`,      color: "#10B981" },
          { label: "Outstanding",      value: `K${totalRemaining.toLocaleString()}`,   color: "#F59E0B" },
          { label: "Active Loans",     value: activeCount,                             color: "#8B5CF6" },
          { label: "Overdue Loans",    value: overdueCount,                            color: "#EF4444" },
          { label: "Completed Loans",  value: completedCount,                          color: "#6B7280" },
        ].map(card => (
          <div key={card.label} style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #EAECF0" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: card.color, marginBottom: 4 }}>{card.value}</div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Export */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 32, border: "1px solid #EAECF0", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F0C29", marginBottom: 8 }}>Export Loan Data</h3>
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 24 }}>Download all loan records as a CSV file. Opens in Excel or Google Sheets.</p>
        <button onClick={handleExport} style={{ padding: "12px 32px", background: "linear-gradient(135deg, #10B981, #059669)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          ⬇ Export to CSV
        </button>
      </div>
    </Layout>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

export default function TreasurerReports() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [community, setCommunity] = useState(null);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });

    axios.get(`${API}/communities/my`, { headers }).then(commRes => {
      if (commRes.data.length === 0) return;
      const myComm = commRes.data[0];
      setCommunity(myComm);

      axios.get(`${API}/loans`, { headers }).then(res => {
        const filtered = res.data.filter(l => String(l.community_id) === String(myComm.id));
        setLoans(filtered);
      }).catch(() => {});
    }).catch(() => {});
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const exportReport = async () => {
    setExporting(true);
    try {
      const res = await axios.get(`${API}/export/report`, {
        headers,
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fundflow-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
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
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>
          Summary statistics{community ? ` for ${community.name}` : ""}.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Disbursed", value: `K${totalDisbursed.toLocaleString()}` },
          { label: "Total Repaid", value: `K${totalRepaid.toLocaleString()}` },
          { label: "Outstanding", value: `K${totalRemaining.toLocaleString()}` },
          { label: "Active Loans", value: activeCount },
          { label: "Overdue Loans", value: overdueCount },
          { label: "Completed Loans", value: completedCount },
        ].map(card => (
          <div key={card.label} style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", border: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#9CA3AF", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>{card.label}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#111827" }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 10, padding: 32, border: "1px solid #E5E7EB", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 8 }}>Export Full Report</h3>
        <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 24 }}>Download a PDF with fund summary, loans, and contributions.</p>
        <button onClick={exportReport} disabled={exporting}
          style={{ padding: "10px 28px", background: exporting ? "#9CA3AF" : "#059669", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: exporting ? "default" : "pointer", fontFamily: "inherit" }}>
          {exporting ? "Generating…" : "⬇ Export PDF"}
        </button>
      </div>
    </Layout>
  );
}
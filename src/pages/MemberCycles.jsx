import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, User, CheckCircle, Clock } from "lucide-react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "http://localhost:8000/api";

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #E8EAED",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  padding: "22px 24px",
};

const statusBadge = (status) => {
  const map = {
    pending: { bg: "#FEF3C7", color: "#92400E", label: "Pending" },
    active: { bg: "#DBEAFE", color: "#1E40AF", label: "Active" },
    completed: { bg: "#D1FAE5", color: "#065F46", label: "Completed" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
};

export default function MemberCycles() {
  const [user, setUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [chilimbaEnabled, setChilimbaEnabled] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/me`, { headers }).then(res => setUser(res.data)).catch(() => { localStorage.clear(); navigate("/login"); });
    axios.get(`${API}/communities/my`, { headers }).then(res => {
      if (res.data.length === 0) return;
      const comm = res.data[0];
      setCommunity(comm);
      const enabled = comm.chilimba_enabled ?? false;
      setChilimbaEnabled(enabled);
      if (!enabled) navigate("/member");
    }).catch(() => {});
    axios.get(`${API}/member/cycles`, { headers }).then(res => setCycles(res.data)).catch(() => {});
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const activeCycle = cycles.find(c => c.status === "active") ?? cycles.find(c => c.status === "pending") ?? null;
  const completedCycles = cycles.filter(c => c.status === "completed");
  const myReceivedCycle = cycles.find(c => c.recipient_id === user?.id && c.status === "completed");
  const isCurrentRecipient = activeCycle?.recipient_id === user?.id;

  return (
    <Layout user={user} onLogout={logout} role="member" activePath="/member/cycles" memberChilimbaEnabled={chilimbaEnabled}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Chilimba Cycles</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>
          {community ? <>Rotating savings for <span style={{ fontWeight: 600, color: "#1E3A8A" }}>{community.name}</span></> : ""}
        </p>
      </div>

      {/* CURRENT CYCLE HERO */}
      {activeCycle ? (
        <div style={{ ...card, marginBottom: 16, background: isCurrentRecipient ? "linear-gradient(135deg, #F0FDF4, #DCFCE7)" : "#fff", border: isCurrentRecipient ? "1.5px solid #86EFAC" : "1px solid #E8EAED" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <RefreshCw size={15} color="#9CA3AF" />
            <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>Current Cycle</div>
          </div>

          {isCurrentRecipient && (
            <div style={{ background: "#059669", color: "#fff", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle size={16} color="#fff" />
              You are receiving the pot this round!
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>Cycle {activeCycle.cycle_number}</div>
            {statusBadge(activeCycle.status)}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>Pot Amount</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>K{Number(activeCycle.pot_amount ?? 0).toLocaleString()}</div>
            </div>
            <div style={{ borderLeft: "1px solid #F3F4F6", paddingLeft: 20 }}>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>Recipient</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: activeCycle.recipient ? "#111827" : "#9CA3AF", display: "flex", alignItems: "center", gap: 5 }}>
                {activeCycle.recipient
                  ? <><User size={13} color="#059669" /> {activeCycle.recipient.name}</>
                  : "Not yet assigned"}
              </div>
            </div>
            <div style={{ borderLeft: "1px solid #F3F4F6", paddingLeft: 20 }}>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>Cycle End Date</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
                {activeCycle.payout_date
                  ? new Date(activeCycle.payout_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ ...card, marginBottom: 16, textAlign: "center", padding: "40px 24px" }}>
          <Clock size={32} color="#D1D5DB" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: "#9CA3AF", marginBottom: 4 }}>No active cycle</div>
          <div style={{ fontSize: 13, color: "#D1D5DB" }}>Your treasurer hasn't started a cycle yet.</div>
        </div>
      )}

      {/* SUMMARY STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ ...card }}>
          <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Total Cycles</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{cycles.length}</div>
        </div>
        <div style={{ ...card }}>
          <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Completed</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#059669" }}>{completedCycles.length}</div>
        </div>
        <div style={{ ...card, background: myReceivedCycle ? "#F0FDF4" : isCurrentRecipient ? "#F0FDF4" : "#fff", border: (myReceivedCycle || isCurrentRecipient) ? "1px solid #BBF7D0" : "1px solid #E8EAED" }}>
          <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>My Status</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: (myReceivedCycle || isCurrentRecipient) ? "#059669" : "#374151" }}>
            {myReceivedCycle
              ? `Received in Cycle ${myReceivedCycle.cycle_number}`
              : isCurrentRecipient
              ? "Receiving this round"
              : "Awaiting turn"}
          </div>
        </div>
      </div>

      {/* CYCLE HISTORY */}
      {cycles.length > 0 && (
        <div style={{ ...card }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 16 }}>Cycle History</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cycles.map(cycle => {
              const isMe = cycle.recipient_id === user?.id;
              return (
                <div key={cycle.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", borderRadius: 10,
                  background: isMe ? "#F0FDF4" : "#F9FAFB",
                  border: `1px solid ${isMe ? "#BBF7D0" : "#F3F4F6"}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: isMe ? "#059669" : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <RefreshCw size={14} color={isMe ? "#fff" : "#9CA3AF"} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Cycle {cycle.cycle_number}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                        Pot: K{Number(cycle.pot_amount ?? 0).toLocaleString()}
                        {cycle.payout_date && <> · Ends {new Date(cycle.payout_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {cycle.recipient && (
                      <div style={{ fontSize: 12, fontWeight: 600, color: isMe ? "#059669" : "#374151", display: "flex", alignItems: "center", gap: 4 }}>
                        <User size={12} color={isMe ? "#059669" : "#9CA3AF"} />
                        {isMe ? "You" : cycle.recipient.name}
                      </div>
                    )}
                    {statusBadge(cycle.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Layout>
  );
}
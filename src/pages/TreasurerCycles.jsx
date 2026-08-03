import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Plus, CheckCircle, User } from "lucide-react";
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

export default function TreasurerCycles() {
  const [user, setUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [chilimbaEnabled, setChilimbaEnabled] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState(0);
  const [newPayoutDate, setNewPayoutDate] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [assigningCycleId, setAssigningCycleId] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toggling, setToggling] = useState(false);
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
      setSavedAmount(Number(comm.contribution_amount ?? 0));
      setContributionAmount(String(comm.contribution_amount ?? ""));
      setChilimbaEnabled(comm.chilimba_enabled ?? false);
      const m = comm.members?.filter(m => m.pivot?.role === "member") ?? [];
      setMembers(m);
    }).catch(() => {});
    axios.get(`${API}/cycles`, { headers }).then(res => setCycles(res.data)).catch(() => {});
  }, []);

  const logout = () => {
    axios.post(`${API}/logout`, {}, { headers }).finally(() => { localStorage.clear(); navigate("/login"); });
  };

  const toggleChilimba = async () => {
    setToggling(true);
    try {
      const res = await axios.post(`${API}/cycles/toggle-chilimba`, {}, { headers });
      setChilimbaEnabled(res.data.chilimba_enabled);
    } catch (e) {}
    setToggling(false);
  };

  const saveContributionAmount = async () => {
    if (!contributionAmount || isNaN(contributionAmount)) return;
    setSaving(true);
    try {
      await axios.post(`${API}/cycles/contribution-amount`, { contribution_amount: contributionAmount }, { headers });
      setSavedAmount(Number(contributionAmount));
      const res = await axios.get(`${API}/cycles`, { headers });
      setCycles(res.data);
    } catch (e) {}
    setSaving(false);
  };

  const createCycle = async () => {
    setCreating(true);
    try {
      const res = await axios.post(`${API}/cycles`, { payout_date: newPayoutDate || null, notes: newNotes || null }, { headers });
      setCycles(prev => [...prev, res.data]);
      setNewPayoutDate("");
      setNewNotes("");
    } catch (e) {}
    setCreating(false);
  };

  const assignRecipient = async (cycleId) => {
    if (!selectedRecipient) return;
    try {
      const res = await axios.post(`${API}/cycles/${cycleId}/assign`, { recipient_id: selectedRecipient }, { headers });
      setCycles(prev => prev.map(c => c.id === cycleId ? res.data : c));
      setAssigningCycleId(null);
      setSelectedRecipient("");
    } catch (e) {}
  };

  const completeCycle = async (cycleId) => {
    try {
      const res = await axios.post(`${API}/cycles/${cycleId}/complete`, {}, { headers });
      setCycles(prev => prev.map(c => c.id === cycleId ? res.data : c));
    } catch (e) {}
  };

  const recipientsWhoHaveReceived = cycles.filter(c => c.status === "completed" && c.recipient_id).map(c => c.recipient_id);
  const eligibleMembers = members.filter(m => !recipientsWhoHaveReceived.includes(m.id));
  const potAmount = savedAmount * members.length;

  return (
    <Layout user={user} onLogout={logout} role="treasurer" activePath="/treasurer/cycles" chilimbaEnabled={chilimbaEnabled}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Chilimba Cycles</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>
          {community ? <>Managing cycles for <span style={{ fontWeight: 600, color: "#1E3A8A" }}>{community.name}</span></> : ""}
        </p>
      </div>

      {/* CHILIMBA TOGGLE */}
      <div style={{ ...card, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Chilimba Mode</div>
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>
            {chilimbaEnabled
              ? "Rotating savings is active. Members receive the pot each cycle."
              : "Enable to activate rotating savings (Chilimba) for this group."}
          </div>
        </div>
        <button onClick={toggleChilimba} disabled={toggling}
          style={{
            padding: "9px 20px",
            background: chilimbaEnabled ? "#FEF2F2" : "linear-gradient(135deg, #1E3A8A, #2563EB)",
            color: chilimbaEnabled ? "#DC2626" : "#fff",
            border: chilimbaEnabled ? "1px solid #FECACA" : "none",
            borderRadius: 8, fontSize: 13, fontWeight: 600,
            cursor: toggling ? "default" : "pointer", fontFamily: "inherit", flexShrink: 0
          }}>
          {toggling ? "Saving…" : chilimbaEnabled ? "Disable Chilimba" : "Enable Chilimba"}
        </button>
      </div>

      {/* REST ONLY SHOWS IF ENABLED */}
      {chilimbaEnabled && (
        <>
          {/* CONTRIBUTION AMOUNT */}
          <div style={{ ...card, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 16 }}>Fixed Contribution Amount</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>K</div>
              <input type="number" value={contributionAmount} onChange={e => setContributionAmount(e.target.value)}
                placeholder="e.g. 500"
                style={{ padding: "9px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontWeight: 600, width: 160, fontFamily: "inherit", outline: "none" }} />
              <button onClick={saveContributionAmount} disabled={saving}
                style={{ padding: "9px 20px", background: saving ? "#9CA3AF" : "#1E3A8A", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? "default" : "pointer", fontFamily: "inherit" }}>
                {saving ? "Saving…" : "Save"}
              </button>
              {savedAmount > 0 && (
                <div style={{ fontSize: 13, color: "#6B7280" }}>
                  Each cycle pot: <span style={{ fontWeight: 700, color: "#111827" }}>K{potAmount.toLocaleString()}</span> ({members.length} members × K{savedAmount.toLocaleString()})
                </div>
              )}
            </div>
          </div>

          {/* CREATE NEW CYCLE */}
          {savedAmount > 0 && (
            <div style={{ ...card, marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 16 }}>Start New Cycle</div>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>Cycle End Date (optional)</div>
                  <input type="date" value={newPayoutDate} onChange={e => setNewPayoutDate(e.target.value)}
                    style={{ padding: "9px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>Notes (optional)</div>
                  <input type="text" value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder="e.g. July round"
                    style={{ width: "100%", padding: "9px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                </div>
                <button onClick={createCycle} disabled={creating}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 20px", background: creating ? "#9CA3AF" : "linear-gradient(135deg, #059669, #10B981)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: creating ? "default" : "pointer", fontFamily: "inherit" }}>
                  <Plus size={15} />
                  {creating ? "Creating…" : "Create Cycle"}
                </button>
              </div>
            </div>
          )}

          {/* CYCLES LIST */}
          {cycles.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: "48px 24px" }}>
              <RefreshCw size={36} color="#D1D5DB" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "#9CA3AF", marginBottom: 6 }}>No cycles yet</div>
              <div style={{ fontSize: 13, color: "#D1D5DB" }}>Set a contribution amount and create your first cycle above.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cycles.map(cycle => (
                <div key={cycle.id} style={{ ...card, padding: "18px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <RefreshCw size={18} color="#2563EB" />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Cycle {cycle.cycle_number}</div>
                        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                          Pot: <span style={{ fontWeight: 600, color: "#374151" }}>K{(Number(cycle.pot_amount) || potAmount).toLocaleString()}</span>
                          {cycle.payout_date && <> · Ends: {new Date(cycle.payout_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</>}
                          {cycle.notes && <> · {cycle.notes}</>}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {statusBadge(cycle.status)}

                      {cycle.recipient ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#059669" }}>
                          <User size={14} color="#059669" />
                          {cycle.recipient.name}
                        </div>
                      ) : (
                        cycle.status !== "completed" && (
                          assigningCycleId === cycle.id ? (
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <select value={selectedRecipient} onChange={e => setSelectedRecipient(e.target.value)}
                                style={{ padding: "7px 12px", border: "1px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none" }}>
                                <option value="">Select member</option>
                                {eligibleMembers.map(m => (
                                  <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                              </select>
                              <button onClick={() => assignRecipient(cycle.id)}
                                style={{ padding: "7px 14px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                Assign
                              </button>
                              <button onClick={() => { setAssigningCycleId(null); setSelectedRecipient(""); }}
                                style={{ padding: "7px 14px", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setAssigningCycleId(cycle.id)}
                              style={{ padding: "7px 14px", background: "#EFF6FF", color: "#2563EB", border: "1px solid #DBEAFE", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                              Assign Recipient
                            </button>
                          )
                        )
                      )}

                      {cycle.status === "active" && (
                        <button onClick={() => completeCycle(cycle.id)}
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#F0FDF4", color: "#059669", border: "1px solid #BBF7D0", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                          <CheckCircle size={13} />
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SUMMARY */}
          {cycles.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 24 }}>
              {[
                { label: "Total Cycles", value: cycles.length },
                { label: "Completed", value: cycles.filter(c => c.status === "completed").length },
                { label: "Members Remaining", value: eligibleMembers.length },
              ].map(s => (
                <div key={s.label} style={{ ...card }}>
                  <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
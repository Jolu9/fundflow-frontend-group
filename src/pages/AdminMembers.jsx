import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8000/api";

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", national_id: "", address: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchMembers = () => {
    axios.get(`${API}/members`, { headers }).then(res => setMembers(res.data));
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await axios.post(`${API}/members`, form, { headers });
      setSuccess("Member registered successfully.");
      setForm({ name: "", email: "", password: "", phone: "", national_id: "", address: "" });
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register member.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this member?")) return;
    await axios.delete(`${API}/members/${id}`, { headers });
    fetchMembers();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-[#1A237E] text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">FundFlow — Admin</h1>
        <button onClick={() => navigate("/admin")} className="bg-white text-[#1A237E] px-3 py-1 rounded text-sm font-medium">
          ← Back
        </button>
      </nav>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Members</h2>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-bold text-gray-700 mb-4">Register New Member</h3>
          {error && <p className="bg-red-100 text-red-600 p-3 rounded mb-3 text-sm">{error}</p>}
          {success && <p className="bg-green-100 text-green-600 p-3 rounded mb-3 text-sm">{success}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full border border-gray-300 rounded px-3 py-2" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" className="w-full border border-gray-300 rounded px-3 py-2" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" value={form.national_id}
                onChange={e => setForm({ ...form, national_id: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="bg-[#1A237E] text-white px-6 py-2 rounded hover:bg-[#283593]">
                Register Member
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">National ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{m.user?.name}</td>
                  <td className="px-4 py-3">{m.user?.email}</td>
                  <td className="px-4 py-3">{m.phone || "—"}</td>
                  <td className="px-4 py-3">{m.national_id || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      m.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-700 text-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-6 text-center text-gray-400">No members registered</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8000/api";

const homeFor = (role) => {
  if (role === "treasurer") return "/treasurer";
  if (role === "admin") return "/admin";
  return "/member";
};

export default function RequireRole({ allow, children }) {
  const [status, setStatus] = useState("loading");
  const [actualRole, setActualRole] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { setStatus("unauthenticated"); return; }
    axios.get(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setActualRole(res.data.role);
        setStatus(allow.includes(res.data.role) ? "ok" : "denied");
      })
      .catch(() => setStatus("unauthenticated"));
  }, []);

  if (status === "loading") return null;
  if (status === "unauthenticated") return <Navigate to="/login" replace />;
  if (status === "denied") return <Navigate to={homeFor(actualRole)} replace />;
  return children;
}
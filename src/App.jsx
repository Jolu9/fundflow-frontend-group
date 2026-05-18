import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminLoans from "./pages/AdminLoans";
import MemberDashboard from "./pages/MemberDashboard";
import MemberApply from "./pages/MemberApply";
import MemberLoans from "./pages/MemberLoans";
import MemberRepayments from "./pages/MemberRepayments";
import TreasurerDashboard from "./pages/TreasurerDashboard";
import TreasurerLoans from "./pages/TreasurerLoans";
import TreasurerRepayments from "./pages/TreasurerRepayments";
import TreasurerReports from "./pages/TreasurerReports";
import TreasurerUsers from "./pages/TreasurerUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/treasurer/users" element={<TreasurerUsers />} />
        <Route path="/treasurer/reports" element={<TreasurerReports />} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/loans" element={<AdminLoans />} />
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/member/loans" element={<MemberLoans />} />
        <Route path="/member/apply" element={<MemberApply />} />
        <Route path="/member/repayments" element={<MemberRepayments />} />
        <Route path="/treasurer" element={<TreasurerDashboard />} />
        <Route path="/treasurer/loans" element={<TreasurerLoans />} />
        <Route path="/treasurer/repayments" element={<TreasurerRepayments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
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
import MemberProfile from "./pages/MemberProfile";
import TreasurerContributions from "./pages/TreasurerContributions";
import MemberContributions from "./pages/MemberContributions";
import AdminGroups from "./pages/AdminGroups";
import AdminGroupDetail from "./pages/AdminGroupDetail";
import Register from "./pages/Register";
import Setup from "./pages/Setup";
import TreasurerMemberProfile from "./pages/TreasurerMemberProfile";
import TreasurerCycles from "./pages/TreasurerCycles";
import MemberCycles from "./pages/MemberCycles";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/treasurer/members/:id" element={<TreasurerMemberProfile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/treasurer/contributions" element={<TreasurerContributions />} />
        <Route path="/member/contributions" element={<MemberContributions />} />
        <Route path="/member/profile" element={<MemberProfile />} />
        <Route path="/treasurer/users" element={<TreasurerUsers />} />
        <Route path="/treasurer/reports" element={<TreasurerReports />} />
        <Route path="/treasurer/cycles" element={<TreasurerCycles />} />
        <Route path="/member/cycles" element={<MemberCycles />} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/loans" element={<AdminLoans />} />
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/member/loans" element={<MemberLoans />} />
        <Route path="/member/apply" element={<MemberApply />} />
        <Route path="/admin/groups" element={<AdminGroups />} />
        <Route path="/admin/groups/:id" element={<AdminGroupDetail />} />
        <Route path="/member/repayments" element={<MemberRepayments />} />
        <Route path="/treasurer" element={<TreasurerDashboard />} />
        <Route path="/treasurer/loans" element={<TreasurerLoans />} />
        <Route path="/treasurer/repayments" element={<TreasurerRepayments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
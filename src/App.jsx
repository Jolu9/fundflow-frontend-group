import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireRole from "./components/RequireRole";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setup" element={<Setup />} />

        <Route path="/admin" element={<RequireRole allow={["admin"]}><AdminDashboard /></RequireRole>} />
        <Route path="/admin/users" element={<RequireRole allow={["admin"]}><AdminUsers /></RequireRole>} />
        <Route path="/admin/loans" element={<RequireRole allow={["admin"]}><AdminLoans /></RequireRole>} />
        <Route path="/admin/groups" element={<RequireRole allow={["admin"]}><AdminGroups /></RequireRole>} />
        <Route path="/admin/groups/:id" element={<RequireRole allow={["admin"]}><AdminGroupDetail /></RequireRole>} />

        <Route path="/member" element={<RequireRole allow={["member"]}><MemberDashboard /></RequireRole>} />
        <Route path="/member/loans" element={<RequireRole allow={["member"]}><MemberLoans /></RequireRole>} />
        <Route path="/member/apply" element={<RequireRole allow={["member"]}><MemberApply /></RequireRole>} />
        <Route path="/member/repayments" element={<RequireRole allow={["member"]}><MemberRepayments /></RequireRole>} />
        <Route path="/member/contributions" element={<RequireRole allow={["member"]}><MemberContributions /></RequireRole>} />
        <Route path="/member/profile" element={<RequireRole allow={["member"]}><MemberProfile /></RequireRole>} />

        <Route path="/treasurer" element={<RequireRole allow={["treasurer"]}><TreasurerDashboard /></RequireRole>} />
        <Route path="/treasurer/loans" element={<RequireRole allow={["treasurer"]}><TreasurerLoans /></RequireRole>} />
        <Route path="/treasurer/repayments" element={<RequireRole allow={["treasurer"]}><TreasurerRepayments /></RequireRole>} />
        <Route path="/treasurer/reports" element={<RequireRole allow={["treasurer"]}><TreasurerReports /></RequireRole>} />
        <Route path="/treasurer/users" element={<RequireRole allow={["treasurer"]}><TreasurerUsers /></RequireRole>} />
        <Route path="/treasurer/contributions" element={<RequireRole allow={["treasurer"]}><TreasurerContributions /></RequireRole>} />
        <Route path="/treasurer/members/:id" element={<RequireRole allow={["treasurer"]}><TreasurerMemberProfile /></RequireRole>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { Navigate } from 'react-router-dom'; // ⬅️ เพิ่มบรรทัดนี้ที่ด้านบน
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import DashboardStudent from './pages/dashboard/DashboardStudent';
import DashboardStudentStatus from './pages/dashboard/DashboardStudentStatus'; 
import DashboardStudentProfile from './pages/dashboard/DashboardStudentProfile';

import DashboardCompany from './pages/dashboard/DashboardCompany';
import DashboardCompanyJobs from './pages/dashboard/DashboardCompanyJobs';
import DashboardCompanyStatus from './pages/dashboard/DashboardCompanyStatus';
import DashboardCompanyEvaluation from './pages/dashboard/DashboardCompanyEvaluation';
import DashboardCompanyProfile from './pages/dashboard/DashboardCompanyProfile';
import JobDetailPage from './pages/JobDetailPage';
import JobEditPage from './pages/JobEditPage';
import EvaluationCompanyForm from './pages/EvaluationCompanyForm';

import DashboardSupervisor from './pages/dashboard/DashboardSupervisor';
import DashboardSupervisorEvaluation from './pages/dashboard/DashboardSupervisorEvaluation';
import DashboardSupervisorProfile from './pages/dashboard/DashboardSupervisorProfile';
import EvaluationSupervisorForm from './pages/EvaluationSupervisorForm';


import DashboardInstructor from './pages/dashboard/DashboardInstructor';
import DashboardInstructorStudents from './pages/dashboard/DashboardInstructorStudents';
import DashboardInstructorSupervisors from './pages/dashboard/DashboardInstructorSupervisors';
import DashboardInstructorAssign from './pages/dashboard/DashboardInstructorAssign';
import DashboardInstructorScores from './pages/dashboard/DashboardInstructorScores';
import DashboardInstructorProfile from './pages/dashboard/DashboardInstructorProfile';
import StudentDetailPage from './pages/StudentDetailPage';
import SupervisorDetailPage from './pages/SupervisorDetailPage';
import EvaluationPage from './pages/EvaluationPage';

import DashboardAdminApprovals from './pages/dashboard/DashboardAdminApprovals';
import DashboardAdminCompanies from './pages/dashboard/DashboardAdminCompanies';
import DashboardAdminReports from './pages/dashboard/DashboardAdminReports';
import DashboardAdminProfile from './pages/dashboard/DashboardAdminProfile';
import PendingApprovalPage from './pages/PendingApprovalPage';

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    setIsLoggedIn(!!token);
    setUserName(name || '');
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Route สำหรับการลงทะเบียนและการล็อกอิน */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Route สำหรับหน้าของ Student */}
        <Route path="/dashboard/student" element={<DashboardStudent />} />
        <Route path="/student/status" element={<DashboardStudentStatus />} />
        <Route path="/student/profile" element={<DashboardStudentProfile />} />

        {/* Route สำหรับหน้าของ Company */}
        <Route path="/company/profile" element={<DashboardCompanyProfile />} />
        <Route path="/company/jobs" element={<DashboardCompanyJobs />} />
        <Route path="/company/status" element={<DashboardCompanyStatus />} />
        <Route path="/company/evaluation" element={<DashboardCompanyEvaluation />} />
        <Route path="/dashboard/company" element={<DashboardCompany />} />
        <Route path="/dashboard/company/status" element={<DashboardCompanyStatus />} />
        <Route path="/job-detail/:id" element={<JobDetailPage />} />
        <Route path="/job-edit/:id" element={<JobEditPage />} />
        <Route path="/evaluation/company/:id" element={<EvaluationCompanyForm />} />
        <Route path="/evaluation/:id" element={<EvaluationPage />} />

        {/* Route สำหรับหน้าของ Supervisor */}
        <Route path="/dashboard/supervisor" element={<DashboardSupervisor />} />
        <Route path="/supervisor/evaluation" element={<DashboardSupervisorEvaluation />} />
        <Route path="/supervisor/profile" element={<DashboardSupervisorProfile />} />
        <Route path="/evaluation/supervisor/:id" element={<EvaluationSupervisorForm />} />

        {/* Route สำหรับหน้าของ Instructor */}
        <Route path="/dashboard/instructor" element={<DashboardInstructor />} />
        <Route path="/instructor/students" element={<DashboardInstructorStudents />} />
        <Route path="/instructor/supervisors" element={<DashboardInstructorSupervisors />} />
        <Route path="/instructor/assign" element={<DashboardInstructorAssign />} />
        <Route path="/instructor/scores" element={<DashboardInstructorScores />} />
        <Route path="/instructor/profile" element={<DashboardInstructorProfile />} />
        <Route path="/student-detail/:id" element={<StudentDetailPage />} />
        <Route path="/supervisor-detail/:id" element={<SupervisorDetailPage />} />
        
        {/* Route สำหรับหน้าของ Admin */}
        <Route path="/admin/approvals" element={<DashboardAdminApprovals />} />
        <Route path="/admin/companies" element={<DashboardAdminCompanies />} />
        <Route path="/admin/reports" element={<DashboardAdminReports />} />
        <Route path="/admin/profile" element={<DashboardAdminProfile />} /> 
        <Route path="/pending-approval" element={<PendingApprovalPage />} />
        
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

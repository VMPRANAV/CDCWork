import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { Toaster } from 'sonner';
// Student Components
import ProfilePage from './landingPage/profile/profilePage';
import DashBoardPage from './landingPage/dashboard/dashBoardPage';
import StudentApplications from './landingPage/dashboard/MyApplications';
import ViewPost from './landingPage/dashboard/ViewPost';
import AvailableJobs from './landingPage/dashboard/availableJob';

// Auth Components
import Login from './landingPage/authentication/login';
import SignUp from './landingPage/authentication/signup';

// Layouts
import AppLayout from './landingPage/AppLayout';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

// Admin Pages
import { Dashboard } from '@/pages/admin/Dashboard';
import { Students } from '@/pages/admin/Students';
import { Jobs } from '@/pages/admin/Jobs';
import ManagePosts from './landingPage/admin/ManagePosts';
import ManageApplications from './landingPage/admin/ManageApplications';
import AttendanceManager from './landingPage/admin/AttendanceManager';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Student Routes */}
        <Route element={<AppLayout />}>
          <Route path="/student/dashboard" element={<DashBoardPage />} />
          <Route path="/student/profile" element={<ProfilePage />} />
          <Route path="/student/ViewPost" element={<ViewPost/>} />
          <Route path="/student/applications" element={<StudentApplications />} />
          <Route path="/student/availableJob" element={<AvailableJobs />} />
        </Route>
        
        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/jobs" element={<Jobs />} />
          <Route path="/admin/posts" element={<ManagePosts />} />
          <Route path="/admin/applications" element={<ManageApplications />} />
          <Route path="/admin/attendance" element={<AttendanceManager />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    <Toaster position="bottom-right"/>
    </BrowserRouter>
  </StrictMode>,
)

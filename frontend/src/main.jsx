import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';

// Student Components
import StudentDashboard from '@/pages/student/Dashboard';
import Profile from '@/pages/student/Profile';
import StudentApplications from '@/pages/student/Applications';
import StudentPosts from '@/pages/student/Posts';
import AvailableJobs from '@/pages/student/AvailableJobs';
import MyProfile from '@/pages/student/MyProfile';
import Settings from '@/pages/student/Settings';
import { Calendar as StudentCalendar } from '@/pages/student/Calendar';

// Auth Components
import Login from './pages/authentication/login';
import SignUp from './pages/authentication/signup';

// Layouts
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { StudentLayout } from '@/components/student/layout/StudentLayout';

// Admin Pages
import { Dashboard } from '@/pages/admin/Dashboard';
import { Students } from '@/pages/admin/Students';
import { Jobs } from '@/pages/admin/Jobs';
import { Posts } from '@/pages/admin/Posts';
import { Applications } from '@/pages/admin/Applications';
import { Attendance } from '@/pages/admin/Attendance';
import { Calendar as AdminCalendar } from '@/pages/admin/Calendar';
import ProtectedRoute from './components/ProtectedRoute';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/my-profile" element={<MyProfile />} />
          <Route path="/student/posts" element={<StudentPosts />} />
          <Route path="/student/applications" element={<StudentApplications />} />
          <Route path="/student/availableJob" element={<AvailableJobs />} />
          <Route path="/student/calendar" element={<StudentCalendar />} />
          <Route path="/student/settings" element={<Settings />} />
          </Route>
        </Route>
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/jobs" element={<Jobs />} />
          <Route path="/admin/posts" element={<Posts />} />
          <Route path="/admin/applications" element={<Applications />} />
          <Route path="/admin/attendance" element={<Attendance />} />
          <Route path="/admin/calendar" element={<AdminCalendar />} />
          </Route>
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    <Toaster position="bottom-right"/>
    </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)

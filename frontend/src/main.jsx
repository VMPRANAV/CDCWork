import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './index.css'
import ProfilePage from './landingPage/profile/profilePage';
import DashBoardPage from './landingPage/dashboard/dashBoardPage';
import Login from './landingPage/authentication/login';
import SignUp from './landingPage/authentication/signup';
import AdminDashboard from './landingPage/admin/adminDashboard';
import AppLayout from './landingPage/AppLayout';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
         {/* The Group of Routes WITH the sidebar */}
         <Route element={<AppLayout />}>
          <Route path="/student/dashboard" element={<DashBoardPage />} />
          <Route path="/student/profile" element={<ProfilePage />} />
          {/* <Route path="/student/applications" element={<StudentApplications />} /> */}
        </Route>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

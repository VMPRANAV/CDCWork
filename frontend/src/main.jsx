import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './index.css'
import ProfilePage from './landingPage/profile/profilePage';
import DashBoardPage from './landingPage/dashboard/dashBoardPage';
import Login from './landingPage/authentication/login';
import SignUp from './landingPage/authentication/signup';
import AdminDashboard from './landingPage/admin/AdminDashboard';
import StudentApplications from './landingPage/dashboard/MyApplications'
import ViewPost from './landingPage/dashboard/ViewPost';
import AppLayout from './landingPage/AppLayout';
import ManageApplications from './landingPage/admin/ManageApplications';
import ManagePosts from './landingPage/admin/ManagePosts';

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
           <Route path ="/student/ViewPost" element={<ViewPost/>}/>
          <Route path="/student/applications" element={<StudentApplications />} />
          <Route path="/admin/students" element={<AdminDashboard />} />
          <Route path="/admin/applications" element={<ManageApplications />} />
          
         
          <Route path="/admin/Post"element={<ManagePosts/>}/>

        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

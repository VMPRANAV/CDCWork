import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar.jsx'; // The sidebar we just created
import './AppLayout.css'; // The layout's own CSS

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet /> {/* Your pages will render here */}
      </main>
    </div>
  );
};

export default AppLayout;
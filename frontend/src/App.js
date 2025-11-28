import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import NoAccess from './pages/NoAccess';

import './index.css';

function AppRoutes() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <header className="app-header">
          <h1>Candidate Referral System</h1>
          <div className="header-sub">
            <Link to="/" style={{ marginRight: 12 }}>Home</Link>
            <Link to="/user" style={{ marginRight: 8 }}>User</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </header>

        <main style={{ minHeight: '60vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<UserPage />} />

            <Route path="/admin" element={<AdminPage />} />

            <Route path="/no-access" element={<NoAccess />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="app-footer">
          
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

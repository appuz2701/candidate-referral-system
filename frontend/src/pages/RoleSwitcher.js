import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function RoleSwitcher() {
  const { currentUser, loginAsUser, loginAsAdmin, logout } = useAuth();

  return (
    <div style={{ marginTop: 12 }}>
      <div>
        Current role: <strong>{currentUser ? currentUser.role : 'not logged in'}</strong>
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={loginAsUser} style={{ marginRight: 8 }}>Switch to User</button>
        <button onClick={loginAsAdmin} style={{ marginRight: 8 }}>Switch to Admin</button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

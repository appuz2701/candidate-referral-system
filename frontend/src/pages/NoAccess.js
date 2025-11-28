import React from 'react';
import { Link } from 'react-router-dom';

export default function NoAccess() {
  return (
    <div style={{ padding: 12 }}>
      <h3>Access Denied</h3>
      <p>You are not authorized to view this page.</p>
      <p><Link to="/">Go back home</Link></p>
    </div>
  );
}
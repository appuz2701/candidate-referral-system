import React from 'react';
import RoleSwitcher from '../pages/RoleSwitcher';

export default function Home() {
  const styles = {
    container: {
      maxWidth: '700px',
      margin: '60px auto',
      padding: '40px',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    },
    title: { fontSize: '32px', fontWeight: '700', color: '#222', marginBottom: '15px' },
    text: { fontSize: '16px', color: '#444', lineHeight: '1.6', marginBottom: '30px' }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Welcome to Referral System</h2>
      <p style={styles.text}>
        Use the navigation menu to switch between User and Admin dashboards.
Use the role switcher below to simulate login roles.
      </p>
      <RoleSwitcher />
    </div>
  );
}

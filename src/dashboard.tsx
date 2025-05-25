// pages/Dashboard.tsx
import React from 'react';
import { useAuth } from './auth/auth';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      <p>Welcome back, <strong>{user?.UserName}</strong>!</p>

      <button className="btn btn-danger mt-3" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;

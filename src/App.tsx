// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/auth';

import ProtectedRoute from './protectedRoute';
import Dashboard from './dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import '../src/App.css';
import Login from './modules/login';


const App: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <ToastContainer />
      <Router>
        <div className="container mt-4">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;

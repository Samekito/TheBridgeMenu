import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUser } from './api/adminApi';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

import React from 'react';

// Top-level Auth Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false
  });

  if (isLoading) return <div className="min-h-screen flex text-center items-center justify-center">Loading Admin...</div>;
  if (isError || !user) return <Navigate to="/login" replace />;

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
      </Routes>
    </Router>
  )
}

export default App

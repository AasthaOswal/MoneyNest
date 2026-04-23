import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-black">Loading...</div>;
  }

  if (!user) {
    console.log("User is not logged in. From ProtectedRoute.jsx")
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("User is not authorized")
    return <Navigate to="/dashboard/family" replace />;
  }

  return <Outlet />; // 🔥 THIS FIXES YOUR ISSUE
};

export default ProtectedRoute;

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminProtectedRoute: React.FC = () => {
  const { isAdminLoggedIn } = useAdminAuth();
  const location = useLocation();

  if (!isAdminLoggedIn) {
    // If not admin logged in, redirect to admin login page
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // If admin is logged in, render the child routes
  return <Outlet />;
};

export default AdminProtectedRoute;

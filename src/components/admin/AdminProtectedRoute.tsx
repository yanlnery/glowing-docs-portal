import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Loader2 } from 'lucide-react';

const AdminProtectedRoute: React.FC = () => {
  const { isAdminLoggedIn, adminLoginLoading, isVerifiedAdmin, adminSession } = useAdminAuth();
  const location = useLocation();

  // Show loading while verifying admin status
  if (adminLoginLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Verificando permissões...</span>
      </div>
    );
  }

  // If user has session but is not verified admin, they shouldn't access admin routes
  if (adminSession && !isVerifiedAdmin) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  if (!isAdminLoggedIn) {
    // If not admin logged in, redirect to admin login page
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // If admin is logged in and verified, render the child routes
  return <Outlet />;
};

export default AdminProtectedRoute;

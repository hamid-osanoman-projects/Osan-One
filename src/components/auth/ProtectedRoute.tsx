import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { Role } from '../../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-pulse-slow rounded-full bg-primary" />
      </div>
    );
  }

  if (!session || !profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    // If user is logged in but doesn't have the right role, redirect to their default dashboard
    switch (profile.role) {
      case 'Super_HR':
        return <Navigate to="/hr" replace />;
      case 'CEO':
        return <Navigate to="/ceo" replace />;
      case 'Accountant':
        return <Navigate to="/accountant" replace />;
      case 'Employee':
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}

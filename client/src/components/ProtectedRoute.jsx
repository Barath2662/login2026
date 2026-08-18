import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children, requireRole }) => {
  const { isAuthenticated, isInitialized, survivor } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#050505]">
        <Loader2 className="w-12 h-12 text-[#D90429] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole) {
    const userRole = survivor?.role || 'student';
    // Let admin and super_admin access everything
    if (userRole !== requireRole && userRole !== 'admin' && userRole !== 'super_admin' && userRole !== 'admin_power') {
      return <Navigate to="/home" replace />;
    }
  }

  return children || <Outlet />;
};

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { isAdminRole, isCoordinatorRole } from '../store/authStore';
import { Loader2 } from 'lucide-react';

/**
 * 3-role model:
 *  requireRole="admin"       → admin, super_admin, admin_power
 *  requireRole="coordinator" → event_coordinator, special_user, junior_attendance
 *  requireRole="student"     → student only (admins/coordinators are NOT students)
 *  (no requireRole)          → any authenticated user
 */
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
    const isAdmin = isAdminRole(userRole);
    const isCoord = isCoordinatorRole(userRole);

    if (requireRole === 'admin') {
      if (!isAdmin) return <Navigate to="/dashboard" replace />;
    } else if (requireRole === 'coordinator') {
      // Admins can also access coordinator pages
      if (!isAdmin && !isCoord) return <Navigate to="/dashboard" replace />;
    } else if (requireRole === 'student') {
      // Admins and coordinators should NOT see student dashboard — redirect to their own
      if (isAdmin) return <Navigate to="/dashboard/admin" replace />;
      if (isCoord) return <Navigate to="/dashboard/coordinator" replace />;
    }
  }

  return children || <Outlet />;
};

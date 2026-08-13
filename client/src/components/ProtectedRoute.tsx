import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  requirePayment?: boolean;
}

export const ProtectedRoute = ({ requirePayment = false }: ProtectedRouteProps) => {
  const { isInitialized, isAuthenticated, survivor } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-bg-primary">
        <Loader2 size={40} className="text-[var(--color-red)] animate-spin mb-4" />
        <p className="text-text-muted font-mono animate-pulse tracking-widest text-sm uppercase">Authenticating...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to home page but save the attempted url
    return <Navigate to="/app" state={{ from: location }} replace />;
  }

  if (requirePayment && !survivor?.hasPaidFee) {
    // Redirect to armory to pay if payment is required but not paid
    return <Navigate to="/armory" replace />;
  }

  return <Outlet />;
};

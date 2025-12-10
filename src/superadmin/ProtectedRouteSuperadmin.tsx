import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export function ProtectedRouteSuperadmin() {
  const { isAuthenticated, user } = useAuthStore();

  // Check if superadmin is authenticated
  if (!isAuthenticated || user?.role !== 'superadmin') {
    return <Navigate to="/superadmin/login" replace />;
  }

  return <Outlet />;
}

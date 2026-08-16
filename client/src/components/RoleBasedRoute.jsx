import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const RoleBasedRoute = ({ publicElement, studentElement }) => {
  const { token, survivor, isInitialized } = useAuthStore();

  // Wait for auth initialization
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color-red"></div>
      </div>
    );
  }

  // If authenticated as student, show student element
  if (token && survivor?.role === 'student') {
    return studentElement;
  }

  // Otherwise, default to public element
  return publicElement;
};

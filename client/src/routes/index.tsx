import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';

import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { EventsPage } from '../pages/EventsPage';
import { EventDetailsPage } from '../pages/EventDetailsPage';
import { TimelinePage } from '../pages/TimelinePage';
import { GalleryPage } from '../pages/GalleryPage';
import { ContactPage } from '../pages/ContactPage';
import { CoordinatorsPage } from '../pages/CoordinatorsPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { ChangePasswordPage } from '../pages/ChangePasswordPage';
import { CoordinatorPage } from '../pages/CoordinatorPage';
import { AdminPage } from '../pages/AdminPage';

// Nested Dashboard imports
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardHome } from '../pages/dashboard/DashboardHome';
import { ProfilePage as DashboardProfilePage } from '../pages/dashboard/ProfilePage';
import { DashboardEventsPage } from '../pages/dashboard/DashboardEventsPage';
import { MyRegistrationsPage } from '../pages/dashboard/MyRegistrationsPage';
import { MyPaymentPage } from '../pages/dashboard/MyPaymentPage';
import { MyTeamsPage } from '../pages/dashboard/MyTeamsPage';
import { NotificationsPage } from '../pages/dashboard/NotificationsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'home', element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'events/:id', element: <EventDetailsPage /> },
      { path: 'timeline', element: <TimelinePage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'coordinators', element: <CoordinatorsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'alumni-register', element: <RegisterPage /> },
      { path: 'alumni', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'change-password', element: <ChangePasswordPage /> },
      
      // Nested Dashboard Routes with ProtectedRoute
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requireRole="student">
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardHome /> },
          { path: 'profile', element: <DashboardProfilePage /> },
          { path: 'events', element: <DashboardEventsPage /> },
          { path: 'payment', element: <MyPaymentPage /> },
          { path: 'registrations', element: <MyRegistrationsPage /> },
          { path: 'teams', element: <MyTeamsPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
        ],
      },
      
      // Backward compatibility redirects for legacy routes
      { path: 'profile', element: <Navigate to="/dashboard/profile" replace /> },
      { path: 'payment', element: <Navigate to="/dashboard/payment" replace /> },
      { path: 'registered-events', element: <Navigate to="/dashboard/registrations" replace /> },
      { path: 'team', element: <Navigate to="/dashboard/teams" replace /> },
      
      // Coordinator and Admin paths
      {
        path: 'coordinator',
        element: (
          <ProtectedRoute requireRole="event_coordinator">
            <CoordinatorPage />
          </ProtectedRoute>
        ),
      },
      { path: 'event-dashboard', element: <Navigate to="/coordinator" replace /> },
      { path: 'junior-attendance', element: <Navigate to="/coordinator" replace /> },
      
      {
        path: 'admin',
        element: (
          <ProtectedRoute requireRole="admin">
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      { path: 'admin/access-control', element: <Navigate to="/admin" replace /> },
      { path: 'special-user', element: <Navigate to="/admin" replace /> },
      
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

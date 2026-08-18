import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { RoleBasedRoute } from '../components/RoleBasedRoute';
import { BaseLayout } from '../layouts/BaseLayout';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import StudentLayout from '../layouts/StudentLayout';
import CoordinatorLayout from '../layouts/CoordinatorLayout';
import JuniorAttendanceLayout from '../layouts/JuniorAttendanceLayout';
import SpecialUserLayout from '../layouts/SpecialUserLayout';
import AdminLayout from '../layouts/AdminLayout';

import PublicSPAContainer from '../pages/public/PublicSPAContainer';
import StudentSPAContainer from '../pages/student/StudentSPAContainer';



// Student Pages (MPA ones)
import Payment from '../pages/student/Payment';
import RegisteredEvents from '../pages/student/RegisteredEvents';
import Team from '../pages/student/Team';
import Profile from '../pages/student/Profile';
import Notifications from '../pages/student/Notifications';
import StudentDashboard from '../pages/student/StudentDashboard';

// Coordinator Pages
import EventDashboard from '../pages/coordinator/EventDashboard';
import EventStudents from '../pages/coordinator/EventStudents';
import EventAttendance from '../pages/coordinator/EventAttendance';
import EventResults from '../pages/coordinator/EventResults';

// Admin & Others
import JuniorAttendanceDashboard from '../pages/junior-attendance/JuniorAttendanceDashboard';
import PaymentVerification from '../pages/special-user/PaymentVerification';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminEvents from '../pages/admin/AdminEvents';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCoordinators from '../pages/admin/AdminCoordinators';
import AdminRegistrations from '../pages/admin/AdminRegistrations';
import AdminPayments from '../pages/admin/AdminPayments';
import AdminTeams from '../pages/admin/AdminTeams';
import AdminAttendance from '../pages/admin/AdminAttendance';
import AdminReports from '../pages/admin/AdminReports';
import SuperAdminAccess from '../pages/admin/SuperAdminAccess';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      // The Unified Scrollable SPA Route 
      // All sections share this single route node so the container never unmounts (no reload flash)
      {
        path: '/',
        element: <PublicLayout><PublicSPAContainer /></PublicLayout>,
        children: [
          { index: true, element: <Navigate to="/home" replace /> },
          { path: 'home', element: <></> },
          { path: 'events', element: <></> },
          { path: 'about', element: <></> },
          { path: 'legacy', element: <></> },
          { path: 'teams', element: <></> },
          { path: 'sponsors', element: <></> },
          { path: 'alumni', element: <></> },
          { path: 'contact', element: <></> },
        ]
      },



      // Strictly Private Student Routes
      {
        path: '/',
        element: <ProtectedRoute requireRole="student" />,
        children: [
          {
            element: <StudentLayout />,
            children: [
              { path: 'dashboard', element: <StudentDashboard /> },
              { path: 'registered-events', element: <RegisteredEvents /> },
              { path: 'team', element: <Team /> },
              { path: 'profile', element: <Profile /> },
              { path: 'notifications', element: <Notifications /> },
              { path: 'payment', element: <Payment /> },
            ],
          },
        ],
      },

      // Event Coordinator Routes
      {
        path: '/event-dashboard',
        element: <ProtectedRoute requireRole="event_coordinator" />,
        children: [
          {
            element: <CoordinatorLayout />,
            children: [
              { index: true, element: <EventDashboard /> },
              { path: 'students', element: <EventStudents /> },
              { path: 'attendance', element: <EventAttendance /> },
              { path: 'results', element: <EventResults /> },
            ],
          },
        ],
      },

      // Junior Attendance Routes
      {
        path: '/junior-attendance',
        element: <ProtectedRoute requireRole="junior_attendance" />,
        children: [
          {
            element: <JuniorAttendanceLayout />,
            children: [
              { index: true, element: <JuniorAttendanceDashboard /> },
            ],
          },
        ],
      },

      // Special User Routes
      {
        path: '/special-user',
        element: <ProtectedRoute requireRole="special_user" />,
        children: [
          {
            element: <SpecialUserLayout />,
            children: [
              { index: true, element: <PaymentVerification /> },
            ],
          },
        ],
      },

      // Admin Routes
      {
        path: '/admin',
        element: <ProtectedRoute requireRole="admin" />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboard /> },
              { path: 'events', element: <AdminEvents /> },
              { path: 'users', element: <AdminUsers /> },
              { path: 'coordinators', element: <AdminCoordinators /> },
              { path: 'registrations', element: <AdminRegistrations /> },
              { path: 'payments', element: <AdminPayments /> },
              { path: 'teams', element: <AdminTeams /> },
              { path: 'attendance', element: <AdminAttendance /> },
              { path: 'reports', element: <AdminReports /> },
              { path: 'access-control', element: <SuperAdminAccess /> },
            ],
          },
        ],
      },

      // Fallback
      {
        path: '*',
        element: <div>404 Not Found</div>,
      },
    ] // Closes BaseLayout children
  }
]);

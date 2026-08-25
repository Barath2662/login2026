import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';

import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { EventsPage } from '../pages/EventsPage';
import { TimelinePage } from '../pages/TimelinePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { ChangePasswordPage } from '../pages/ChangePasswordPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CoordinatorPage } from '../pages/CoordinatorPage';
import { AdminPage } from '../pages/AdminPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'home', element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'timeline', element: <TimelinePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'alumni-register', element: <RegisterPage /> },
      { path: 'alumni', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'change-password', element: <ChangePasswordPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'profile', element: <DashboardPage /> },
      { path: 'payment', element: <DashboardPage /> },
      { path: 'registered-events', element: <DashboardPage /> },
      { path: 'team', element: <DashboardPage /> },
      { path: 'coordinator', element: <CoordinatorPage /> },
      { path: 'event-dashboard', element: <CoordinatorPage /> },
      { path: 'junior-attendance', element: <CoordinatorPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'admin/access-control', element: <AdminPage /> },
      { path: 'special-user', element: <AdminPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

import { PublicSPA } from '../pages/PublicSPA';
import { EntrySplashPage } from '../pages/EntrySplashPage';
import { HubPage } from '../pages/HubPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ArmoryCheckout } from '../pages/ArmoryCheckout';
import { AdminIdRecordsView } from '../pages/AdminIdRecordsView';

import { useParams } from 'react-router-dom';

const WorldRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/app?world=${id}`} replace />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <EntrySplashPage /> },
      { path: 'app', element: <PublicSPA /> },
      { path: 'worlds', element: <Navigate to="/app#worlds" replace /> },
      { path: 'worlds/:id', element: <WorldRedirect /> },
      { path: 'legacy', element: <Navigate to="/app#hall-of-survivors" replace /> },
      { path: 'contact', element: <Navigate to="/app#contact" replace /> },
      { path: '404', element: <NotFoundPage /> },
      {
        path: '/',
        // Auth-protected routes
        element: <ProtectedRoute />,
        children: [
          { path: 'armory', element: <ArmoryCheckout /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'admin/id-records', element: <AdminIdRecordsView /> },
          {
            path: '/',
            // Payment-verified routes
            element: <ProtectedRoute requirePayment={true} />,
            children: [
              {
                element: <DashboardLayout />,
                children: [
                  { path: 'hub', element: <HubPage /> },
                  { path: 'dashboard', element: <Navigate to="/hub" replace /> },
                ]
              }
            ]
          }
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);

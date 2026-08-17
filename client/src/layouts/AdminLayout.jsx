import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Users, UserCog, FileCheck2, CreditCard, Shield, UserCheck, FileOutput } from 'lucide-react';

const AdminLayout = () => {
  const navItems = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={18} />, exact: true },
    { name: 'Events', path: '/admin/events', icon: <CalendarDays size={18} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={18} /> },
    { name: 'Coordinators', path: '/admin/coordinators', icon: <UserCog size={18} /> },
    { name: 'Registrations', path: '/admin/registrations', icon: <FileCheck2 size={18} /> },
    { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={18} /> },
    { name: 'Teams', path: '/admin/teams', icon: <Shield size={18} /> },
    { name: 'Attendance', path: '/admin/attendance', icon: <UserCheck size={18} /> },
    { name: 'Reports', path: '/admin/reports', icon: <FileOutput size={18} /> },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 relative min-h-[80vh] flex flex-col md:flex-row gap-8">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-color-silver/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 relative z-10">
        <div className="bg-bg-card border border-color-silver/20 rounded-sm overflow-hidden sticky top-24 shadow-2xl">
          <div className="p-4 bg-color-silver/10 border-b border-color-silver/20">
            <h2 className="text-color-silver font-mono font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-color-silver rounded-sm animate-pulse block"></span>
              Admin Override
            </h2>
            <div className="text-xs text-text-muted font-mono mt-1">Level 5 Access Granted</div>
          </div>
          <nav className="p-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-color-silver/10 text-color-silver border-l-2 border-color-silver' 
                      : 'text-text-secondary hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

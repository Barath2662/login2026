import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, Trophy } from 'lucide-react';

const CoordinatorLayout = () => {

  const navItems = [
    { name: 'Overview', path: `/event-dashboard`, icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Students', path: `/event-dashboard/students`, icon: <Users size={20} /> },
    { name: 'Attendance', path: `/event-dashboard/attendance`, icon: <UserCheck size={20} /> },
    { name: 'Results', path: `/event-dashboard/results`, icon: <Trophy size={20} /> },
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
              <span className="w-2 h-2 bg-color-silver rounded-full animate-pulse block"></span>
              Event Command
            </h2>
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
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default CoordinatorLayout;

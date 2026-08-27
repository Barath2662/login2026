import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard, User, Calendar, ClipboardList, Users, Bell,
  LogOut, Menu, X, ChevronRight, KeyRound,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/profile', icon: User, label: 'My Profile', end: false },
  { to: '/dashboard/events', icon: Calendar, label: 'Events', end: false },
  { to: '/dashboard/registrations', icon: ClipboardList, label: 'My Registrations', end: false },
  { to: '/dashboard/teams', icon: Users, label: 'My Teams', end: false },
  { to: '/dashboard/notifications', icon: Bell, label: 'Notifications', end: false },
];

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, resetAuth } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: unreadData } = useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const res = await api.notifications.getUnreadCount();
      return res.data;
    },
    refetchInterval: 30000,
  });

  const unreadCount = unreadData?.count || 0;

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch {}
    resetAuth();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-[2px] text-xs font-mono transition-all ${
      isActive
        ? 'bg-[#E01B22]/15 text-[#E01B22] border-l-2 border-[#E01B22]'
        : 'text-[#A79798] hover:text-[#F7F2F2] hover:bg-[#1A1114]'
    }`;

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Profile Header */}
      <div className="p-5 border-b border-[#2A1A1D]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#7E0910] border border-[#E01B22] flex items-center justify-center font-display font-bold text-sm text-[#F7F2F2]">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-display font-bold text-[#F7F2F2] truncate">{user?.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <KeyRound className="w-3 h-3 text-[#E01B22]" />
              <span className="text-[11px] font-mono text-[#E01B22] font-bold">{user?.login_id || '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileMenuOpen(false)}
            className={linkClass}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{label}</span>
            {label === 'Notifications' && unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#E01B22] text-[#F7F2F2] rounded-full min-w-[18px] text-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[#2A1A1D]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-[2px] text-xs font-mono text-[#A79798] hover:text-[#FF2A2A] hover:bg-[#1A1114] transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0607] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#130C0E] border-r border-[#2A1A1D] flex-col fixed top-0 left-0 h-screen z-30 xl:left-[72px]">
        {sidebar}
      </aside>

      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#130C0E] border-b border-[#2A1A1D] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#E01B22]" />
          <span className="text-sm font-mono font-bold text-[#E01B22]">{user?.login_id || 'DASHBOARD'}</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#A79798] hover:text-[#F7F2F2] transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed top-0 left-0 w-72 h-screen bg-[#130C0E] border-r border-[#2A1A1D] z-50 lg:hidden">
            {sidebar}
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 xl:ml-64 min-h-screen">
        <div className="pt-16 lg:pt-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

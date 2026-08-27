import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { ShieldCheck, Clock, AlertCircle, QrCode, Calendar, Users, Bell, ArrowRight, CreditCard } from 'lucide-react';

export const DashboardHome: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: paymentData } = useQuery({
    queryKey: ['payment-status'],
    queryFn: async () => { const res = await api.payments.getMyStatus(); return res.data; },
  });

  const { data: registrations = [] } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: async () => { const res = await api.registrations.getMyRegistrations(); return res.data || []; },
  });

  const { data: unreadData } = useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => { const res = await api.notifications.getUnreadCount(); return res.data; },
  });

  const pStatus = paymentData?.status || 'NOT_SUBMITTED';
  const regCount = Array.isArray(registrations) ? registrations.length : 0;
  const unreadCount = unreadData?.count || 0;

  return (
    <div className="space-y-8">
      {/* Identity Card */}
      <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 sm:p-8 rounded-[2px] shadow-2xl corner-bracket-container">
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-br" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#7E0910] border-2 border-[#E01B22] flex items-center justify-center font-display font-extrabold text-2xl text-[#F7F2F2]">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-display font-bold text-[#F7F2F2]">{user?.name}</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#1A1114] text-[#FF2A2A] border border-[#3E2529] rounded-[2px] uppercase">
                  {user?.user_type || 'PARTICIPANT'}
                </span>
                {pStatus === 'VERIFIED' ? (
                  <span className="px-3 py-0.5 text-xs font-mono font-bold bg-[#1FA971]/20 text-[#1FA971] border border-[#1FA971] rounded-[2px] flex items-center gap-1.5 shadow-[0_0_12px_rgba(31,169,113,0.3)]">
                    <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                  </span>
                ) : pStatus === 'PENDING' ? (
                  <span className="px-3 py-0.5 text-xs font-mono font-bold bg-[#E08A17]/20 text-[#E08A17] border border-[#E08A17] rounded-[2px] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> PENDING
                  </span>
                ) : (
                  <span className="px-3 py-0.5 text-xs font-mono font-bold bg-[#4A050A] text-[#FF2A2A] border border-[#E01B22] rounded-[2px] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> UNPAID
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A79798] font-mono mt-1.5">{user?.email} • {user?.college_name || 'PSG Tech'}</p>
            </div>
          </div>

          {user?.student_id_code && pStatus === 'VERIFIED' && (
            <div className="bg-[#0A0607] border border-[#1FA971] p-4 rounded-[2px] flex items-center gap-4">
              <QrCode className="w-8 h-8 text-[#1FA971]" />
              <div>
                <span className="mono-label block text-[#A79798] text-[10px]">OFFICIAL STUDENT ID</span>
                <span className="text-lg font-mono font-extrabold text-[#1FA971] tracking-wider">{user.student_id_code}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Journey Tracker */}
      <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-4">
        <span className="text-[10px] font-mono text-[#E01B22] font-bold uppercase tracking-wider">PARTICIPANT JOURNEY</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center">
          <div className="p-3 bg-[#0A0607] border border-[#E01B22] rounded-[2px] text-[#F7F2F2]">
            <span className="text-[10px] text-[#E01B22] block">STEP 01</span>
            <strong className="block mt-1">REGISTERED ✓</strong>
          </div>
          <div className={`p-3 rounded-[2px] border ${pStatus !== 'NOT_SUBMITTED' ? 'bg-[#0A0607] border-[#E01B22] text-[#F7F2F2]' : 'bg-[#0A0607] border-[#2A1A1D] text-[#6B5A5C]'}`}>
            <span className="text-[10px] block text-[#6B5A5C]">STEP 02</span>
            <strong className="block mt-1">PAYMENT</strong>
          </div>
          <div className={`p-3 rounded-[2px] border ${pStatus === 'VERIFIED' ? 'bg-[#0A0607] border-[#1FA971] text-[#1FA971]' : 'bg-[#0A0607] border-[#2A1A1D] text-[#6B5A5C]'}`}>
            <span className="text-[10px] block text-[#6B5A5C]">STEP 03</span>
            <strong className="block mt-1">VERIFIED</strong>
          </div>
          <div className={`p-3 rounded-[2px] border ${regCount > 0 ? 'bg-[#0A0607] border-[#E01B22] text-[#F7F2F2]' : 'bg-[#0A0607] border-[#2A1A1D] text-[#6B5A5C]'}`}>
            <span className="text-[10px] block text-[#6B5A5C]">STEP 04</span>
            <strong className="block mt-1">EVENTS ({regCount})</strong>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: 'Browse Events', desc: `${regCount} registered`, to: '/dashboard/events', color: '#E01B22' },
          { icon: Users, label: 'My Teams', desc: 'Manage teams', to: '/dashboard/teams', color: '#E08A17' },
          { icon: CreditCard, label: 'Payment', desc: pStatus, to: '/dashboard/payment', color: '#1FA971' },
          { icon: Bell, label: 'Notifications', desc: `${unreadCount} unread`, to: '/dashboard/notifications', color: '#6366F1' },
        ].map(({ icon: Icon, label, desc, to, color }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="bg-[#130C0E] border border-[#2A1A1D] hover:border-[#3E2529] p-5 rounded-[2px] text-left transition-all hover:bg-[#1A1114] group"
          >
            <Icon className="w-6 h-6 mb-3" style={{ color }} />
            <p className="text-sm font-display font-bold text-[#F7F2F2]">{label}</p>
            <p className="text-[11px] font-mono text-[#6B5A5C] mt-0.5">{desc}</p>
            <ArrowRight className="w-3.5 h-3.5 text-[#6B5A5C] mt-2 group-hover:text-[#F7F2F2] transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

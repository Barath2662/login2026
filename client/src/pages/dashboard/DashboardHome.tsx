import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { ShieldCheck, Clock, AlertCircle, QrCode, Calendar, Users, ArrowRight, CreditCard, CheckCircle, Copy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardHome: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [newLoginId, setNewLoginId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const id = localStorage.getItem('newLoginId');
    if (id) {
      setNewLoginId(id);
      localStorage.removeItem('newLoginId');
    }
  }, []);

  const { data: paymentData } = useQuery({
    queryKey: ['payment-status'],
    queryFn: async () => { const res = await api.payments.getMyStatus(); return res.data; },
  });

  const { data: registrations = [] } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: async () => { const res = await api.registrations.getMyRegistrations(); return res.data || []; },
  });

  const pStatus = paymentData?.status || 'NOT_SUBMITTED';

  const regCount = Array.isArray(registrations) ? registrations.length : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence>
        {newLoginId && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="bg-[#130C0E] border-2 border-[#1FA971] p-6 rounded-[2px] shadow-[0_0_30px_rgba(31,169,113,0.15)] flex flex-col items-center justify-center text-center space-y-4 relative"
          >
            <button onClick={() => setNewLoginId(null)} className="absolute top-4 right-4 text-[#A79798] hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-[#1FA971]/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#1FA971]" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-[#F7F2F2]">Registration Successful!</h2>
              <p className="text-xs text-[#A79798] font-mono mt-1">Please save your Participant ID for future logins.</p>
            </div>
            <div className="bg-[#0A0607] border border-[#2A1A1D] px-6 py-3 rounded-[2px] flex items-center gap-4">
              <span className="text-2xl font-mono font-black text-[#1FA971] tracking-[4px] select-all">{newLoginId}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(newLoginId)}
                className="p-2 hover:bg-[#2A1A1D] rounded-[2px] transition-colors"
                title="Copy ID"
              >
                <Copy className="w-4 h-4 text-[#A79798]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Identity Card */}
      <motion.div variants={itemVariants} className="bg-[#130C0E] border border-[#2A1A1D] p-6 sm:p-8 rounded-[2px] shadow-2xl corner-bracket-container">
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

          {user?.student_id_code && pStatus === 'VERIFIED' ? (
            <div className="bg-[#0A0607] border border-[#1FA971] p-4 rounded-[2px] flex items-center gap-4">
              <QrCode className="w-8 h-8 text-[#1FA971]" />
              <div>
                <span className="mono-label block text-[#A79798] text-[10px]">OFFICIAL STUDENT ID</span>
                <span className="text-lg font-mono font-extrabold text-[#1FA971] tracking-wider">{user.student_id_code}</span>
              </div>
            </div>
          ) : (
            <div className="flex gap-6 sm:gap-10">
              <div className="text-center">
                <span className="text-[10px] font-mono text-[#A79798] uppercase tracking-wider block mb-1">EVENTS</span>
                <span className="text-xl font-display font-bold text-[#F7F2F2]">{regCount}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-mono text-[#A79798] uppercase tracking-wider block mb-1">TEAMS</span>
                <span className="text-xl font-display font-bold text-[#F7F2F2]">0</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-mono text-[#A79798] uppercase tracking-wider block mb-1">PAYMENT</span>
                <span className={`text-sm font-mono font-bold uppercase ${pStatus === 'VERIFIED' ? 'text-[#1FA971]' : pStatus === 'PENDING' ? 'text-[#E08A17]' : 'text-[#E01B22]'}`}>
                  {pStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Next Action Alert */}
      {pStatus !== 'VERIFIED' && (
        <motion.div variants={itemVariants} className="bg-[#1A0306] border border-[#E01B22] p-4 rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_20px_rgba(224,27,34,0.1)]">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#E01B22]" />
            <div>
              <h3 className="text-sm font-mono font-bold text-[#FF2A2A] uppercase tracking-wider">ACTION REQUIRED</h3>
              <p className="text-xs font-mono text-[#F7F2F2] mt-0.5 opacity-90">
                {pStatus === 'PENDING' ? 'Your payment is currently under review.' : 'Complete your payment to proceed with event registration.'}
              </p>
            </div>
          </div>
          {pStatus === 'NOT_SUBMITTED' && (
            <button
              onClick={() => navigate('/dashboard/payment')}
              className="px-6 py-2.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] transition-colors w-full sm:w-auto text-center"
            >
              Complete Payment
            </button>
          )}
        </motion.div>
      )}

      {/* Journey Tracker */}
      <motion.div variants={itemVariants} className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-6 overflow-x-auto">
        <span className="text-[10px] font-mono text-[#E01B22] font-bold uppercase tracking-wider block mb-2">PARTICIPANT JOURNEY</span>
        <div className="flex items-center min-w-[600px] sm:min-w-0">
          {/* REGISTERED */}
          <div className="flex flex-col items-center flex-1 relative">
            <div className="w-8 h-8 rounded-full bg-[#1FA971]/20 border border-[#1FA971] flex items-center justify-center z-10 text-[#1FA971] shadow-[0_0_12px_rgba(31,169,113,0.3)]">
              ✓
            </div>
            <span className="text-[10px] font-mono font-bold text-[#1FA971] mt-2">REGISTERED</span>
            <div className={`absolute top-4 left-1/2 right-[-50%] h-0.5 ${pStatus !== 'NOT_SUBMITTED' ? 'bg-[#1FA971]' : 'bg-[#2A1A1D]'}`} />
          </div>
          {/* PAYMENT */}
          <div className="flex flex-col items-center flex-1 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${pStatus === 'VERIFIED' ? 'bg-[#1FA971]/20 border border-[#1FA971] text-[#1FA971] shadow-[0_0_12px_rgba(31,169,113,0.3)]' : pStatus === 'PENDING' ? 'bg-[#E08A17]/20 border border-[#E08A17] text-[#E08A17] shadow-[0_0_12px_rgba(224,138,23,0.3)]' : pStatus === 'NOT_SUBMITTED' ? 'bg-[#4A050A] border border-[#E01B22] text-[#FF2A2A] shadow-[0_0_12px_rgba(224,27,34,0.5)]' : 'bg-[#130C0E] border border-[#2A1A1D] text-[#6B5A5C]'}`}>
              {pStatus === 'VERIFIED' ? '✓' : pStatus === 'PENDING' ? <Clock className="w-4 h-4" /> : '2'}
            </div>
            <span className={`text-[10px] font-mono font-bold mt-2 ${pStatus === 'VERIFIED' ? 'text-[#1FA971]' : pStatus === 'PENDING' ? 'text-[#E08A17]' : pStatus === 'NOT_SUBMITTED' ? 'text-[#FF2A2A]' : 'text-[#6B5A5C]'}`}>PAYMENT</span>
            <div className={`absolute top-4 left-[-50%] right-1/2 h-0.5 ${pStatus !== 'NOT_SUBMITTED' ? 'bg-[#1FA971]' : 'bg-[#2A1A1D]'}`} />
            <div className={`absolute top-4 left-1/2 right-[-50%] h-0.5 ${pStatus === 'VERIFIED' ? 'bg-[#1FA971]' : 'bg-[#2A1A1D]'}`} />
          </div>
          {/* VERIFIED */}
          <div className="flex flex-col items-center flex-1 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${pStatus === 'VERIFIED' ? 'bg-[#1FA971]/20 border border-[#1FA971] text-[#1FA971] shadow-[0_0_12px_rgba(31,169,113,0.3)]' : 'bg-[#130C0E] border border-[#2A1A1D] text-[#6B5A5C]'}`}>
              {pStatus === 'VERIFIED' ? '✓' : '3'}
            </div>
            <span className={`text-[10px] font-mono font-bold mt-2 ${pStatus === 'VERIFIED' ? 'text-[#1FA971]' : 'text-[#6B5A5C]'}`}>VERIFIED</span>
            <div className={`absolute top-4 left-[-50%] right-1/2 h-0.5 ${pStatus === 'VERIFIED' ? 'bg-[#1FA971]' : 'bg-[#2A1A1D]'}`} />
            <div className={`absolute top-4 left-1/2 right-[-50%] h-0.5 ${regCount > 0 ? 'bg-[#1FA971]' : 'bg-[#2A1A1D]'}`} />
          </div>
          {/* EVENTS */}
          <div className="flex flex-col items-center flex-1 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${regCount > 0 ? 'bg-[#1FA971]/20 border border-[#1FA971] text-[#1FA971] shadow-[0_0_12px_rgba(31,169,113,0.3)]' : pStatus === 'VERIFIED' ? 'bg-[#4A050A] border border-[#E01B22] text-[#FF2A2A] shadow-[0_0_12px_rgba(224,27,34,0.5)]' : 'bg-[#130C0E] border border-[#2A1A1D] text-[#6B5A5C]'}`}>
              {regCount > 0 ? '✓' : '4'}
            </div>
            <span className={`text-[10px] font-mono font-bold mt-2 ${regCount > 0 ? 'text-[#1FA971]' : pStatus === 'VERIFIED' ? 'text-[#FF2A2A]' : 'text-[#6B5A5C]'}`}>EVENTS</span>
            <div className={`absolute top-4 left-[-50%] right-1/2 h-0.5 ${regCount > 0 ? 'bg-[#1FA971]' : 'bg-[#2A1A1D]'}`} />
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Calendar, title: 'Browse Events', desc: `${regCount} registered`, to: '/dashboard/events', color: '#E01B22', btnLabel: 'VIEW EVENTS', highlight: false },
          { icon: Users, title: 'My Teams', desc: 'Manage your team', to: '/dashboard/teams', color: '#E08A17', btnLabel: 'MANAGE TEAM', highlight: false },
          { icon: CreditCard, title: 'Payment', desc: pStatus.replace('_', ' '), to: '/dashboard/payment', color: '#1FA971', btnLabel: 'PAYMENT PORTAL', highlight: pStatus === 'NOT_SUBMITTED' },
        ].map(({ icon: Icon, title, desc, to, color, btnLabel, highlight }) => (
          <div key={to} className={`bg-[#130C0E] border ${highlight ? 'border-[#E01B22] shadow-[0_0_15px_rgba(224,27,34,0.15)]' : 'border-[#2A1A1D] hover:border-[#3E2529]'} p-6 rounded-[2px] flex flex-col justify-between transition-all group`}>
            <div>
              <Icon className="w-6 h-6 mb-3" style={{ color }} />
              <h3 className="text-lg font-display font-bold text-[#F7F2F2]">{title}</h3>
              <p className="text-xs font-mono text-[#6B5A5C] mt-1 uppercase">{desc}</p>
            </div>
            <button
              onClick={() => navigate(to)}
              className={`mt-6 w-full py-2.5 px-4 text-xs font-mono font-bold rounded-[2px] transition-colors border flex items-center justify-center gap-2 ${
                highlight
                  ? 'bg-[#E01B22] border-[#E01B22] text-[#F7F2F2] hover:bg-[#FF2A2A]'
                  : 'bg-[#1A1114] border-[#3E2529] text-[#A79798] hover:text-[#F7F2F2] hover:bg-[#2A1A1D]'
              }`}
            >
              {btnLabel} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Recent Activity Feed */}
      <motion.div variants={itemVariants} className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-4">
        <span className="text-[10px] font-mono text-[#E01B22] font-bold uppercase tracking-wider block border-b border-[#2A1A1D] pb-3">RECENT ACTIVITY</span>
        <div className="space-y-4 pt-2">
          {/* Account Created (Always true if they are logged in) */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-[#1FA971] mt-1.5" />
              <div className="w-px h-full bg-[#2A1A1D] my-1" />
            </div>
            <div className="pb-4">
              <p className="text-sm font-mono text-[#F7F2F2]">Account registered successfully</p>
              <p className="text-[10px] font-mono text-[#6B5A5C] mt-0.5">Welcome to LOGIN 2K26</p>
            </div>
          </div>
          
          {/* Payment Status */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-2 h-2 rounded-full ${pStatus === 'VERIFIED' ? 'bg-[#1FA971]' : pStatus === 'PENDING' ? 'bg-[#E08A17]' : 'bg-[#E01B22]'} mt-1.5`} />
              <div className="w-px h-full bg-[#2A1A1D] my-1" />
            </div>
            <div className="pb-4">
              <p className="text-sm font-mono text-[#F7F2F2]">
                {pStatus === 'VERIFIED' ? 'Payment verified' : pStatus === 'PENDING' ? 'Payment under review' : 'Payment pending'}
              </p>
              <p className="text-[10px] font-mono text-[#6B5A5C] mt-0.5">
                {pStatus === 'VERIFIED' ? 'You are authorized for event registration' : 'Action required to unlock events'}
              </p>
            </div>
          </div>

          {/* Registration Status */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-2 h-2 rounded-full ${regCount > 0 ? 'bg-[#1FA971]' : 'bg-[#6B5A5C]'} mt-1.5`} />
            </div>
            <div>
              <p className="text-sm font-mono text-[#F7F2F2]">
                {regCount > 0 ? `Registered for ${regCount} event(s)` : 'No events registered yet'}
              </p>
              <p className="text-[10px] font-mono text-[#6B5A5C] mt-0.5">
                {regCount > 0 ? 'View your events in the dashboard' : 'Browse available events to participate'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

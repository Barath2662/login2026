import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Users, Calendar, ClipboardCheck, DollarSign, Loader2, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    registrations: 0,
    payments: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, eventsRes, regsRes, paymentsRes] = await Promise.allSettled([
          api.get('/users/'),
          api.get('/events/'),
          api.get('/registrations/'),
          api.get('/payments/')
        ]);

        setStats({
          users: usersRes.status === 'fulfilled' ? (usersRes.value.data.data || usersRes.value.data).length : 0,
          events: eventsRes.status === 'fulfilled' ? (eventsRes.value.data.data || eventsRes.value.data).length : 0,
          registrations: regsRes.status === 'fulfilled' ? (regsRes.value.data.data || regsRes.value.data).length : 0,
          payments: paymentsRes.status === 'fulfilled' ? (paymentsRes.value.data.data || paymentsRes.value.data).length : 0,
        });
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.users, icon: <Users size={24} />, color: 'text-zinc-400', border: 'border-zinc-400' },
    { label: 'Total Events', value: stats.events, icon: <Calendar size={24} />, color: 'text-red-500', border: 'border-red-500' },
    { label: 'Total Registrations', value: stats.registrations, icon: <ClipboardCheck size={24} />, color: 'text-red-500', border: 'border-red-500' },
    { label: 'Total Payments', value: stats.payments, icon: <DollarSign size={24} />, color: 'text-zinc-500', border: 'border-zinc-500' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div>
        <GlitchText as="h1" className="text-3xl font-mono font-bold uppercase tracking-widest text-white mb-2">
          System <span className="text-color-silver">Overview</span>
        </GlitchText>
        <p className="text-text-secondary font-mono text-sm">
          High-level metrics for the entire Multiverse system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className={`bg-bg-card border border-border-color p-6 rounded-sm hover:border-${stat.color.split('-')[1]}-500/50 transition-colors relative overflow-hidden group`}>
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-${stat.color.split('-')[1]}-500 to-transparent opacity-50`} />
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 bg-black/40 rounded-sm border border-border-color ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            
            <div>
              <div className="text-4xl font-black font-mono text-white mb-1">{stat.value}</div>
              <div className="text-sm text-text-muted font-mono uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-color-red/5 border border-color-red/20 p-6 rounded-sm mt-8">
        <h3 className="text-color-red font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
          <ShieldAlert size={18} /> Admin Directives
        </h3>
        <ul className="text-sm text-text-secondary space-y-2 list-disc pl-5">
          <li>Monitor system health and intervene if anomalies are detected.</li>
          <li>Ensure all event coordinators have been assigned their respective events.</li>
          <li>Review special user payment verifications periodically.</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;

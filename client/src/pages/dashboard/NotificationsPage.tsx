import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Bell, Check } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.notifications.getMy();
      return res.data || [];
    },
  });

  const readMutation = useMutation({
    mutationFn: async (id: number) => await api.notifications.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  const readAllMutation = useMutation({
    mutationFn: async () => await api.notifications.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-[#F7F2F2]">Notifications</h1>
          <p className="text-xs text-[#6B5A5C] font-mono mt-1">Updates and alerts from the organizing team</p>
        </div>
        {notifications.some((n: any) => !n.is_read) && (
          <button
            onClick={() => readAllMutation.mutate()}
            className="px-4 py-2 bg-[#E01B22]/15 hover:bg-[#E01B22]/25 text-[#E01B22] border border-[#E01B22]/30 text-xs font-mono font-bold rounded-[2px] flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />MARK ALL AS READ
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-xs font-mono text-[#6B5A5C]">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-[#130C0E] border border-[#2A1A1D] rounded-[2px] p-12 text-center space-y-3">
          <Bell className="w-10 h-10 text-[#2A1A1D] mx-auto" />
          <p className="text-xs font-mono text-[#6B5A5C]">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif: any) => (
            <div
              key={notif.id}
              className={`p-4 rounded-[2px] border transition-colors flex items-start gap-4 ${
                notif.is_read
                  ? 'bg-[#130C0E] border-[#2A1A1D]'
                  : 'bg-[#1A1114] border-[#E01B22]/30 shadow-[0_0_15px_rgba(224,27,34,0.05)]'
              }`}
            >
              <div className={`p-2 rounded-full shrink-0 ${notif.is_read ? 'bg-[#2A1A1D] text-[#6B5A5C]' : 'bg-[#E01B22]/15 text-[#E01B22]'}`}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className={`text-xs font-bold ${notif.is_read ? 'text-[#A79798]' : 'text-[#F7F2F2]'}`}>
                    {notif.title}
                  </h3>
                  {!notif.is_read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E01B22]" />
                  )}
                </div>
                <p className="text-xs text-[#A79798] leading-relaxed">{notif.message}</p>
                <span className="block text-[9px] font-mono text-[#6B5A5C]">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
              {!notif.is_read && (
                <button
                  onClick={() => readMutation.mutate(notif.id)}
                  className="text-[#6B5A5C] hover:text-[#1FA971] p-1.5 transition-colors rounded-[2px] hover:bg-[#1FA971]/10"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default NotificationsPage;

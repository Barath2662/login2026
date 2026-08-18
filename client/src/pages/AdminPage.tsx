import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const AdminPage: React.FC = () => {
  const location = useLocation();
  const { user: currentUser } = useAuthStore();
  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin_power';
  
  const [activeTab, setActiveTab] = useState<'PAYMENTS' | 'USERS' | 'ANNOUNCEMENTS' | 'SETTINGS' | 'EVENTS'>(
    location.pathname.includes('access-control') ? 'USERS' : 'PAYMENTS'
  );

  // Data states
  const [payments, setPayments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // Reject modal state
  const [rejectModalPaymentId, setRejectModalPaymentId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Announcement Form State
  const [newAnnoTitle, setNewAnnoTitle] = useState('');
  const [newAnnoMessage, setNewAnnoMessage] = useState('');
  const [newAnnoPriority, setNewAnnoPriority] = useState<'normal' | 'high' | 'urgent'>('normal');

  const fetchData = async () => {
    try {
      const [payRes, userRes, annoRes, eventRes] = await Promise.all([
        api.payments.getAll(),
        api.users.getAll(),
        api.announcements.getActive(),
        api.events.getAll(),
      ]);

      if (Array.isArray(payRes.data)) setPayments(payRes.data);
      if (Array.isArray(userRes.data)) setUsers(userRes.data);
      if (Array.isArray(annoRes.data)) setAnnouncements(annoRes.data);
      if (Array.isArray(eventRes.data)) setEvents(eventRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifyPayment = async (id: number) => {
    try {
      await api.payments.verify(id, { status: 'VERIFIED' });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to verify payment.');
    }
  };

  const handleRejectPayment = async () => {
    if (!rejectModalPaymentId || !rejectionReason.trim()) return;

    try {
      await api.payments.verify(rejectModalPaymentId, {
        status: 'REJECTED',
        rejection_reason: rejectionReason,
      });

      setRejectModalPaymentId(null);
      setRejectionReason('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject payment.');
    }
  };

  const handleRoleChange = async (userId: number, role: string) => {
    try {
      await api.users.updateRole(userId, role);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnoTitle.trim() || !newAnnoMessage.trim()) return;

    try {
      await api.announcements.create({
        title: newAnnoTitle,
        message: newAnnoMessage,
        priority: newAnnoPriority,
      });

      setNewAnnoTitle('');
      setNewAnnoMessage('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create announcement.');
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    try {
      await api.announcements.delete(id);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete announcement.');
    }
  };

  const handleUpdateEvent = async (id: number, currentVenue: string, currentTime: string) => {
    const newVenue = prompt('Enter new venue (leave empty to keep current):', currentVenue);
    if (newVenue === null) return;
    
    const newTime = prompt('Enter new start time (e.g. 09:00:00) (leave empty to keep current):', currentTime);
    if (newTime === null) return;

    if (newVenue === currentVenue && newTime === currentTime) return;

    try {
      await api.events.update(id, {
        venue: newVenue || currentVenue,
        start_time: newTime || currentTime
      });
      alert('Event updated and emails dispatched successfully!');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update event.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0607] py-12 px-4 sm:px-6 lg:px-8 text-[#F7F2F2]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A1A1D] pb-6">
          <div>
            <span className="mono-label text-[#FF2A2A] font-bold uppercase">ADMINISTRATION</span>
            <h1 className="display-m text-[#F7F2F2]">SYSTEM CONTROL PANEL</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-[#130C0E] p-1.5 rounded-[2px] border border-[#2A1A1D]">
            <button
              onClick={() => setActiveTab('PAYMENTS')}
              className={`px-4 py-2 rounded-[2px] font-mono text-xs font-bold transition-colors ${
                activeTab === 'PAYMENTS' ? 'bg-[#E01B22] text-[#F7F2F2]' : 'text-[#A79798] hover:text-[#F7F2F2]'
              }`}
            >
              PAYMENTS QUEUE
            </button>
            <button
              onClick={() => setActiveTab('USERS')}
              className={`px-4 py-2 rounded-[2px] font-mono text-xs font-bold transition-colors ${
                activeTab === 'USERS' ? 'bg-[#E01B22] text-[#F7F2F2]' : 'text-[#A79798] hover:text-[#F7F2F2]'
              }`}
            >
              USERS & ROLES
            </button>
            <button
              onClick={() => setActiveTab('ANNOUNCEMENTS')}
              className={`px-4 py-2 rounded-[2px] font-mono text-xs font-bold transition-colors ${
                activeTab === 'ANNOUNCEMENTS' ? 'bg-[#E01B22] text-[#F7F2F2]' : 'text-[#A79798] hover:text-[#F7F2F2]'
              }`}
            >
              ANNOUNCEMENTS
            </button>
            <button
              onClick={() => setActiveTab('EVENTS')}
              className={`px-4 py-2 rounded-[2px] font-mono text-xs font-bold transition-colors ${
                activeTab === 'EVENTS' ? 'bg-[#E01B22] text-[#F7F2F2]' : 'text-[#A79798] hover:text-[#F7F2F2]'
              }`}
            >
              EVENTS
            </button>
          </div>
        </div>

        {/* Tab 1: Payments Verification Queue */}
        {activeTab === 'PAYMENTS' && (
          <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-6">
            <h2 className="text-lg font-display font-bold text-[#F7F2F2]">PAYMENT VERIFICATION QUEUE ({payments.length})</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-body">
                <thead className="bg-[#0A0607] text-[#6B5A5C] font-mono border-b border-[#3E2529]">
                  <tr>
                    <th className="p-3.5">USER</th>
                    <th className="p-3.5">REFERENCE / UTR</th>
                    <th className="p-3.5">STATUS</th>
                    <th className="p-3.5">STUDENT ID</th>
                    <th className="p-3.5">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A1A1D]">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#1A1114] transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-[#F7F2F2]">{p.user?.name}</div>
                        <div className="text-[10px] text-[#A79798] font-mono">{p.user?.email}</div>
                      </td>
                      <td className="p-3.5 font-mono text-[#E08A17]">{p.transaction_reference}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          p.status === 'VERIFIED' ? 'chip-verified' : p.status === 'REJECTED' ? 'chip-rejected' : 'chip-pending'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[#1FA971] font-bold">{p.user?.student_id_code || '-'}</td>
                      <td className="p-3.5 flex items-center gap-2">
                        {p.status !== 'VERIFIED' && (
                          <button
                            onClick={() => handleVerifyPayment(p.id)}
                            className="px-3 py-1 bg-[#1FA971] text-[#0A0607] font-mono font-bold text-[10px] rounded-[2px]"
                          >
                            APPROVE ✓
                          </button>
                        )}
                        {p.status !== 'REJECTED' && (
                          <button
                            onClick={() => setRejectModalPaymentId(p.id)}
                            className="px-3 py-1 bg-[#7E0910] text-[#F7F2F2] font-mono font-bold text-[10px] rounded-[2px]"
                          >
                            REJECT ✗
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Users & Roles */}
        {activeTab === 'USERS' && (
          <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-6">
            <h2 className="text-lg font-display font-bold text-[#F7F2F2]">REGISTERED USERS ({users.length})</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-body">
                <thead className="bg-[#0A0607] text-[#6B5A5C] font-mono border-b border-[#3E2529]">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">NAME & EMAIL</th>
                    <th className="p-3.5">TYPE</th>
                    <th className="p-3.5">CURRENT ROLE</th>
                    <th className="p-3.5">CHANGE ROLE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A1A1D]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#1A1114] transition-colors">
                      <td className="p-3.5 font-mono text-[#6B5A5C]">#{u.id}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-[#F7F2F2]">{u.name}</div>
                        <div className="text-[10px] text-[#A79798] font-mono">{u.email}</div>
                      </td>
                      <td className="p-3.5 font-mono text-[#E08A17]">{u.user_type || 'PARTICIPANT'}</td>
                      <td className="p-3.5 font-mono text-[#FF2A2A] font-bold">{u.role}</td>
                      <td className="p-3.5">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] px-2 py-1 rounded-[2px] text-xs font-mono outline-none"
                        >
                          <option value="student">student</option>
                          <option value="event_coordinator">event_coordinator</option>
                          <option value="admin">admin</option>
                          {isSuperAdmin && (
                            <>
                              <option value="junior_attendance">junior_attendance</option>
                              <option value="special_user">special_user</option>
                              <option value="super_admin">super_admin</option>
                              <option value="admin_power">admin_power</option>
                            </>
                          )}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Announcements */}
        {activeTab === 'ANNOUNCEMENTS' && (
          <div className="space-y-8">
            <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-4">
              <h2 className="text-lg font-display font-bold text-[#F7F2F2]">BROADCAST ANNOUNCEMENT TO TICKER</h2>

              <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs font-body">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[#A79798] mb-1 font-semibold">Title Tag *</label>
                    <input
                      type="text"
                      value={newAnnoTitle}
                      onChange={(e) => setNewAnnoTitle(e.target.value)}
                      placeholder="e.g. VENUE CHANGE"
                      required
                      className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A79798] mb-1 font-semibold">Priority</label>
                    <select
                      value={newAnnoPriority}
                      onChange={(e: any) => setNewAnnoPriority(e.target.value)}
                      className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none font-mono"
                    >
                      <option value="normal">normal</option>
                      <option value="high">high</option>
                      <option value="urgent">urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#A79798] mb-1 font-semibold">Broadcast Message *</label>
                  <textarea
                    value={newAnnoMessage}
                    onChange={(e) => setNewAnnoMessage(e.target.value)}
                    placeholder="Enter ticker notice message..."
                    required
                    className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none h-20"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> BROADCAST TICKER NOTICE
                </button>
              </form>
            </div>

            {/* List Active */}
            <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-4">
              <h3 className="font-display font-bold text-sm text-[#F7F2F2]">ACTIVE TICKER ANNOUNCEMENTS</h3>

              <div className="space-y-3">
                {announcements.map((a) => (
                  <div key={a.id} className="bg-[#0A0607] border border-[#2A1A1D] p-4 rounded-[2px] flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-[#E08A17] text-xs">[{a.title}]</span>
                      <p className="text-xs text-[#F7F2F2] mt-1">{a.message}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnouncement(a.id)}
                      className="text-[#A79798] hover:text-[#E01B22] p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Events & Notifications */}
        {activeTab === 'EVENTS' && (
          <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-6">
            <div>
              <h2 className="text-lg font-display font-bold text-[#F7F2F2]">EVENT MANAGEMENT ({events.length})</h2>
              <p className="text-xs text-[#A79798] font-mono mt-1">Updating an event's venue or time will automatically email all registered participants.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-body">
                <thead className="bg-[#0A0607] text-[#6B5A5C] font-mono border-b border-[#3E2529]">
                  <tr>
                    <th className="p-3.5">EVENT NAME</th>
                    <th className="p-3.5">CATEGORY</th>
                    <th className="p-3.5">DAY & DATE</th>
                    <th className="p-3.5">VENUE</th>
                    <th className="p-3.5">START TIME</th>
                    <th className="p-3.5">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A1A1D]">
                  {events.map((evt) => (
                    <tr key={evt.id} className="hover:bg-[#1A1114] transition-colors">
                      <td className="p-3.5 font-bold text-[#F7F2F2]">{evt.name}</td>
                      <td className="p-3.5 font-mono text-[#E08A17]">{evt.category}</td>
                      <td className="p-3.5 font-mono text-[#A79798]">Day {evt.day} | {evt.date}</td>
                      <td className="p-3.5 font-mono text-[#F7F2F2]">{evt.venue}</td>
                      <td className="p-3.5 font-mono text-[#F7F2F2]">{evt.start_time}</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleUpdateEvent(evt.id, evt.venue, evt.start_time)}
                          className="px-3 py-1 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono font-bold text-[10px] rounded-[2px]"
                        >
                          EDIT
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Reject Modal */}
      {rejectModalPaymentId && (
        <div className="fixed inset-0 z-50 bg-[#0A0607]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#130C0E] border border-[#E01B22] w-full max-w-md p-6 rounded-[2px] space-y-4">
            <h3 className="font-display font-bold text-lg text-[#F7F2F2]">REJECT PAYMENT REFERENCE</h3>
            <p className="text-xs text-[#A79798]">Provide a mandatory rejection reason to inform the participant.</p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Invalid transaction ID / UTR not found on bank statement..."
              className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-3 rounded-[2px] text-xs outline-none h-28"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectModalPaymentId(null)}
                className="px-4 py-2 text-xs font-mono text-[#A79798]"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectPayment}
                disabled={!rejectionReason.trim()}
                className="px-6 py-2 bg-[#E01B22] disabled:opacity-50 text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px]"
              >
                CONFIRM REJECTION
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

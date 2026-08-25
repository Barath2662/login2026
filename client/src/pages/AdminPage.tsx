import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { Plus, Trash2, Download, Search, ShieldAlert, Radio, Trophy, Pencil } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const AdminPage: React.FC = () => {
  const location = useLocation();
  const { user: currentUser } = useAuthStore();
  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin_power';
  
  const [activeTab, setActiveTab] = useState<'PAYMENTS' | 'PARTICIPANTS' | 'ALUMNI' | 'POWER_PEOPLE' | 'DASHBOARD' | 'ANNOUNCEMENTS' | 'EVENTS'>(
    location.pathname.includes('access-control') ? 'POWER_PEOPLE' : 'PAYMENTS'
  );

  // Data states
  const [payments, setPayments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [allRegistrations, setAllRegistrations] = useState<any[]>([]);

  // Search & Filter States
  const [paymentSearch, setPaymentSearch] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('ALL');

  // Reject modal state
  const [rejectModalPaymentId, setRejectModalPaymentId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Announcement Form State
  const [newAnnoTitle, setNewAnnoTitle] = useState('');
  const [newAnnoMessage, setNewAnnoMessage] = useState('');
  const [newAnnoPriority, setNewAnnoPriority] = useState<'normal' | 'high' | 'urgent'>('normal');

  // Create User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('event_coordinator');
  const [newUserEventId, setNewUserEventId] = useState('');
  const [newUserCollege, setNewUserCollege] = useState('PSG College of Technology');
  const [newUserDepartment, setNewUserDepartment] = useState('Computer Applications');
  const [creatingUser, setCreatingUser] = useState(false);

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
      
      if (Array.isArray(eventRes.data)) {
        setEvents(eventRes.data);
        
        // Fetch all registrations across all events for event-wise analysis
        const regPromises = eventRes.data.map((evt: any) =>
          api.registrations.getEventRegistrations(evt.id).then((r) => ({
            eventId: evt.id,
            eventName: evt.name,
            registrations: Array.isArray(r.data) ? r.data : [],
          })).catch(() => ({ eventId: evt.id, eventName: evt.name, registrations: [] }))
        );
        const regResults = await Promise.all(regPromises);
        setAllRegistrations(regResults);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Add New User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      alert('Please enter Name, Email, and Password.');
      return;
    }

    try {
      setCreatingUser(true);
      await api.users.create({
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        phone: newUserPhone.trim() || '9876543210',
        password: newUserPassword,
        role: newUserRole,
        event_id: newUserRole === 'event_coordinator' ? Number(newUserEventId) : undefined,
        college_name: newUserCollege.trim(),
        department: newUserDepartment.trim(),
      });

      alert('User created and saved to database successfully!');
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPhone('');
      setNewUserPassword('');
      setNewUserEventId('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setCreatingUser(false);
    }
  };

  // Reject Payment (Approve removed as requested — UTR submission automatically allows student to register)
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

  const handleVerifyPayment = async (paymentId: number) => {
    try {
      await api.payments.verify(paymentId, { status: 'VERIFIED' });
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to verify payment.');
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

  const editManagedUser = async (user: any) => {
    const name = window.prompt('Name:', user.name || '');
    if (name === null) return;
    const email = window.prompt('Email:', user.email || '');
    if (email === null) return;
    const phone = window.prompt('Phone:', user.phone || '');
    if (phone === null) return;
    const college_name = window.prompt('College:', user.college_name || '');
    if (college_name === null) return;
    const department = window.prompt('Department:', user.department || '');
    if (department === null) return;
    const roll_no = window.prompt('Roll number:', user.roll_no || '');
    if (roll_no === null) return;
    let alumniFields = {};
    if (user.user_type === 'ALUMNI') {
      const batch_year = window.prompt('Batch year:', user.batch_year || '');
      if (batch_year === null) return;
      const place = window.prompt('Place:', user.place || '');
      if (place === null) return;
      const current_organization = window.prompt('Current organization:', user.current_organization || '');
      if (current_organization === null) return;
      alumniFields = { batch_year, place, current_organization };
    }

    try {
      await api.users.updateDetails(user.id, {
        name: name.trim(), email: email.trim(), phone: phone.trim(), college_name: college_name.trim(),
        department: department.trim(), roll_no: roll_no.trim(), ...alumniFields,
      });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user details.');
    }
  };

  const deleteManagedUser = async (user: any) => {
    if (!window.confirm(`Delete ${user.name || 'this user'} permanently?`)) return;

    try {
      await api.users.delete(user.id);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user.');
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

      alert('Announcement created and broadcasted to coordinators & admins!');
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
      alert('Event updated and emails dispatched to registered students!');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update event.');
    }
  };

  // CSV Export for Payments Queue
  const exportPaymentsCSV = () => {
    const headers = ['User Name', 'Email', 'Phone', 'College', 'UTR Reference', 'Status', 'Student ID', 'Created At'];
    const rows = payments.map((p) => [
      `"${p.student?.name || p.user?.name || 'Participant'}"`,
      `"${p.student?.email || p.user?.email || '-'}"`,
      `"${p.student?.phone || p.user?.phone || '-'}"`,
      `"${p.student?.college_name || p.user?.college_name || '-'}"`,
      `"${p.transaction_reference || '-'}"`,
      `"${p.status}"`,
      `"${p.student?.student_id_code || p.user?.student_id_code || '-'}"`,
      `"${p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LOGIN_2K26_Payments_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Export for Event Registrations
  const exportEventRegistrationsCSV = () => {
    const headers = ['Event Name', 'Student Name', 'Student ID', 'Email', 'Phone', 'College', 'Department', 'Team Name', 'Attendance Status'];
    const rows: string[][] = [];

    allRegistrations.forEach((eventGroup) => {
      eventGroup.registrations.forEach((reg: any) => {
        rows.push([
          `"${eventGroup.eventName}"`,
          `"${reg.student?.name || reg.user?.name || 'Student'}"`,
          `"${reg.student?.student_id_code || reg.user?.student_id_code || '-'}"`,
          `"${reg.student?.email || reg.user?.email || '-'}"`,
          `"${reg.student?.phone || reg.user?.phone || '-'}"`,
          `"${reg.student?.college_name || reg.user?.college_name || '-'}"`,
          `"${reg.student?.department || reg.user?.department || '-'}"`,
          `"${reg.team?.name || reg.team_name || 'Solo'}"`,
          `"${reg.attendance_status || (reg.attended ? 'PRESENT' : 'REGISTERED')}"`,
        ]);
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LOGIN_2K26_Event_Registrations_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Lists
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const name = (p.student?.name || p.user?.name || '').toLowerCase();
      const email = (p.student?.email || p.user?.email || '').toLowerCase();
      const ref = (p.transaction_reference || '').toLowerCase();
      const s = paymentSearch.toLowerCase().trim();
      return name.includes(s) || email.includes(s) || ref.includes(s);
    });
  }, [payments, paymentSearch]);

  const powerUsers = useMemo(() => {
    return users.filter((u) => u.role !== 'student');
  }, [users]);

  const alumniUsers = useMemo(() => {
    return users.filter((u) => u.user_type === 'ALUMNI');
  }, [users]);

  const exportAlumniCSV = async () => {
    try {
      const response = await api.exports.getAlumni();
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `LOGIN_2K26_Alumni_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to export alumni roster.');
    }
  };

  // Telemetry Calculations
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const verifiedPaymentsCount = payments.filter((p) => p.status === 'VERIFIED').length;
  
  let totalEnrollments = 0;
  let totalAttended = 0;
  allRegistrations.forEach((eg) => {
    totalEnrollments += eg.registrations.length;
    totalAttended += eg.registrations.filter((r: any) => r.attended || r.attendance_status === 'PRESENT').length;
  });
  const overallAttendancePercentage = totalEnrollments > 0 ? Math.round((totalAttended / totalEnrollments) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0A0607] py-12 px-4 sm:px-6 lg:px-8 text-[#F7F2F2]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[#2A1A1D] pb-6">
          <div>
            <span className="mono-label text-[#FF2A2A] font-bold uppercase tracking-wider">COMMAND CENTER</span>
            <h1 className="display-m text-[#F7F2F2] mt-1">ADMIN CONTROL PANEL</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#130C0E] p-1.5 rounded-[2px] border border-[#2A1A1D]">
            <button
              onClick={() => setActiveTab('PAYMENTS')}
              className={`px-3.5 py-2 rounded-[2px] font-mono text-xs font-bold transition-colors ${
                activeTab === 'PAYMENTS' ? 'bg-[#E01B22] text-[#F7F2F2]' : 'text-[#A79798] hover:text-[#F7F2F2]'
              }`}
            >
              PAYMENTS QUEUE ({payments.length})
            </button>
            <button
              onClick={() => setActiveTab('PARTICIPANTS')}
              className={`px-3.5 py-2 rounded-[2px] font-mono text-xs font-bold transition-colors ${
                activeTab === 'PARTICIPANTS' ? 'bg-[#E01B22] text-[#F7F2F2]' : 'text-[#A79798] hover:text-[#F7F2F2]'
              }`}
            >
              EVENT-WISE ROSTER
            </button>
            <button
              onClick={() => setActiveTab('ALUMNI')}
              className={`px-3.5 py-2 rounded-[2px] font-mono text-xs font-bold transition-colors ${
                activeTab === 'ALUMNI' ? 'bg-[#E01B22] text-[#F7F2F2]' : 'text-[#A79798] hover:text-[#F7F2F2]'
              }`}
            >
              ALUMNI ROSTER ({alumniUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('POWER_PEOPLE')}
              className={`px-3.5 py-2 rounded-[2px] font-mono text-xs font-bold transition-colors ${
                activeTab === 'POWER_PEOPLE' ? 'bg-[#E01B22] text-[#F7F2F2]' : 'text-[#A79798] hover:text-[#F7F2F2]'
              }`}
            >
              POWER PERSONNEL ({powerUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`px-3.5 py-2 rounded-[2px] font-mono text-xs font-bold transition-colors ${
                activeTab === 'DASHBOARD' ? 'bg-[#E01B22] text-[#F7F2F2]' : 'text-[#A79798] hover:text-[#F7F2F2]'
              }`}
            >
              TELEMETRY &amp; STATS
            </button>
            <button
              onClick={() => setActiveTab('ANNOUNCEMENTS')}
              className={`px-3.5 py-2 rounded-[2px] font-mono text-xs font-bold transition-colors ${
                activeTab === 'ANNOUNCEMENTS' ? 'bg-[#E01B22] text-[#F7F2F2]' : 'text-[#A79798] hover:text-[#F7F2F2]'
              }`}
            >
              BROADCAST
            </button>
            <button
              onClick={() => setActiveTab('EVENTS')}
              className={`px-3.5 py-2 rounded-[2px] font-mono text-xs font-bold transition-colors ${
                activeTab === 'EVENTS' ? 'bg-[#E01B22] text-[#F7F2F2]' : 'text-[#A79798] hover:text-[#F7F2F2]'
              }`}
            >
              EVENTS ({events.length})
            </button>
          </div>
        </div>

        {/* TAB 1: PAYMENTS VERIFICATION QUEUE (Reject Only & CSV Export) */}
        {activeTab === 'PAYMENTS' && (
          <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-display font-bold text-[#F7F2F2]">
                  PAYMENT VERIFICATION QUEUE ({filteredPayments.length})
                </h2>
                <p className="text-xs text-[#A79798] font-mono mt-0.5">
                  UTR submission auto-unlocks registrations. Desk officials can reject invalid references.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-[#A79798] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    placeholder="Search UTR / Name..."
                    className="w-full bg-[#0A0607] border border-[#2A1A1D] pl-9 pr-3 py-1.5 text-xs text-[#F7F2F2] rounded-[2px] outline-none font-mono"
                  />
                </div>
                <button
                  onClick={exportPaymentsCSV}
                  className="px-4 py-2 bg-[#1A1114] hover:bg-[#2A1A1D] border border-[#3E2529] hover:border-[#E01B22] text-[#F7F2F2] font-mono text-xs font-bold rounded-[2px] flex items-center gap-2 transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-[#E01B22]" /> EXPORT CSV
                </button>
              </div>
            </div>

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
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#1A1114] transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-[#F7F2F2]">{p.student?.name || p.user?.name || 'Participant'}</div>
                        <div className="text-[10px] text-[#A79798] font-mono">{p.student?.email || p.user?.email || '-'}</div>
                      </td>
                      <td className="p-3.5 font-mono text-[#E08A17] font-bold">{p.transaction_reference}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          p.status === 'VERIFIED' ? 'chip-verified' : p.status === 'REJECTED' ? 'chip-rejected' : 'chip-pending'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[#1FA971] font-bold">{p.student?.student_id_code || p.user?.student_id_code || '-'}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => editManagedUser(p.student || p.user)} title="Edit participant details" className="p-1.5 text-[#E08A17] hover:text-[#F7F2F2]"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => deleteManagedUser(p.student || p.user)} title="Delete participant" className="p-1.5 text-[#E01B22] hover:text-[#FF2A2A]"><Trash2 className="w-3.5 h-3.5" /></button>
                          {p.status !== 'VERIFIED' && p.status !== 'REJECTED' && <button onClick={() => handleVerifyPayment(p.id)} className="px-3.5 py-1.5 bg-[#1FA971] hover:bg-[#27C487] text-[#0A0607] font-mono font-bold text-[10px] rounded-[2px] transition-colors">VERIFY ✓</button>}
                          {p.status !== 'REJECTED' && <button onClick={() => setRejectModalPaymentId(p.id)} className="px-3.5 py-1.5 bg-[#7E0910] hover:bg-[#E01B22] text-[#F7F2F2] font-mono font-bold text-[10px] rounded-[2px] transition-colors">REJECT ✗</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: EVENT-WISE REGISTERED PARTICIPANTS LIST & EXPORT */}
        {activeTab === 'PARTICIPANTS' && (
          <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-display font-bold text-[#F7F2F2]">
                  EVENT-WISE REGISTRATION ROSTER
                </h2>
                <p className="text-xs text-[#A79798] font-mono mt-0.5">
                  Inspect student enrollments per competition arena and export complete roster.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedEventFilter}
                  onChange={(e) => setSelectedEventFilter(e.target.value)}
                  className="bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] px-3 py-1.5 rounded-[2px] text-xs font-mono outline-none"
                >
                  <option value="ALL">ALL ARENAS ({allRegistrations.reduce((acc, curr) => acc + curr.registrations.length, 0)} ENROLLMENTS)</option>
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id.toString()}>{evt.name}</option>
                  ))}
                </select>

                <button
                  onClick={exportEventRegistrationsCSV}
                  className="px-4 py-1.5 bg-[#1A1114] hover:bg-[#2A1A1D] border border-[#3E2529] hover:border-[#E01B22] text-[#F7F2F2] font-mono text-xs font-bold rounded-[2px] flex items-center gap-2 transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-[#E01B22]" /> EXPORT ENROLLMENTS CSV
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {allRegistrations
                .filter((eg) => selectedEventFilter === 'ALL' || eg.eventId.toString() === selectedEventFilter)
                .map((eventGroup) => (
                  <div key={eventGroup.eventId} className="bg-[#0A0607] border border-[#2A1A1D] rounded-[2px] p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#2A1A1D] pb-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-[#E01B22]" />
                        <h3 className="font-display font-bold text-sm text-[#F7F2F2]">{eventGroup.eventName}</h3>
                      </div>
                      <span className="font-mono text-xs text-[#E08A17] font-bold">
                        {eventGroup.registrations.length} ENROLLED
                      </span>
                    </div>

                    {eventGroup.registrations.length === 0 ? (
                      <div className="text-xs font-mono text-[#6B5A5C] py-2">No students enrolled yet.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-body">
                          <thead className="text-[#6B5A5C] font-mono border-b border-[#2A1A1D]">
                            <tr>
                              <th className="py-2 px-3">STUDENT ID</th>
                              <th className="py-2 px-3">PARTICIPANT</th>
                              <th className="py-2 px-3">COLLEGE</th>
                              <th className="py-2 px-3">TEAM / SQUAD</th>
                              <th className="py-2 px-3">ATTENDANCE</th>
                              <th className="py-2 px-3">ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1A1114]">
                            {eventGroup.registrations.map((reg: any) => (
                              <tr key={reg.id} className="hover:bg-[#130C0E]">
                                <td className="py-2 px-3 font-mono text-[#1FA971] font-bold">
                                  {reg.student?.student_id_code || reg.user?.student_id_code || '-'}
                                </td>
                                <td className="py-2 px-3">
                                  <div className="font-bold text-[#F7F2F2]">{reg.student?.name || reg.user?.name || 'Participant'}</div>
                                  <div className="text-[10px] text-[#A79798] font-mono">{reg.student?.email || reg.user?.email || '-'}</div>
                                </td>
                                <td className="py-2 px-3 font-mono text-[#A79798]">
                                  {reg.student?.college_name || reg.user?.college_name || 'PSG Tech'}
                                </td>
                                <td className="py-2 px-3 font-mono text-[#E08A17]">
                                  {reg.team?.name || reg.team_name || 'SOLO'}
                                </td>
                                <td className="py-2 px-3">
                                  <span className={`px-2 py-0.5 rounded-[2px] font-mono text-[10px] font-bold ${
                                    reg.attended || reg.attendance_status === 'PRESENT'
                                      ? 'bg-[#1FA971]/20 text-[#1FA971] border border-[#1FA971]'
                                      : 'bg-[#1A1114] text-[#A79798] border border-[#2A1A1D]'
                                  }`}>
                                    {reg.attended || reg.attendance_status === 'PRESENT' ? 'PRESENT ✓' : 'REGISTERED'}
                                  </span>
                                </td>
                                <td className="py-2 px-3">
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => editManagedUser(reg.student || reg.user)} title="Edit participant details" className="p-1.5 text-[#E08A17] hover:text-[#F7F2F2]"><Pencil className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => deleteManagedUser(reg.student || reg.user)} title="Delete participant" className="p-1.5 text-[#E01B22] hover:text-[#FF2A2A]"><Trash2 className="w-3.5 h-3.5" /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: ALUMNI ROSTER */}
        {activeTab === 'ALUMNI' && (
          <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-display font-bold text-[#F7F2F2]">REGISTERED ALUMNI</h2>
                <p className="text-xs text-[#A79798] font-mono mt-0.5">Alumni RSVP records only. This roster is restricted to administrators.</p>
              </div>
              <button
                onClick={exportAlumniCSV}
                className="px-4 py-1.5 bg-[#1A1114] hover:bg-[#2A1A1D] border border-[#3E2529] hover:border-[#E01B22] text-[#F7F2F2] font-mono text-xs font-bold rounded-[2px] flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-[#E01B22]" /> EXPORT ALUMNI CSV
              </button>
            </div>

            {alumniUsers.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#6B5A5C] font-mono">No alumni registrations found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-body">
                  <thead className="bg-[#0A0607] text-[#6B5A5C] font-mono border-b border-[#3E2529]">
                    <tr>
                      <th className="p-3.5">NAME</th>
                      <th className="p-3.5">EMAIL</th>
                      <th className="p-3.5">PHONE</th>
                      <th className="p-3.5">BATCH</th>
                      <th className="p-3.5">PLACE</th>
                      <th className="p-3.5">ORGANIZATION</th>
                      <th className="p-3.5">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A1A1D]">
                    {alumniUsers.map((alumni) => (
                      <tr key={alumni.id} className="hover:bg-[#1A1114]">
                        <td className="p-3.5 font-bold text-[#F7F2F2]">{alumni.name}</td>
                        <td className="p-3.5 font-mono text-[#A79798]">{alumni.email}</td>
                        <td className="p-3.5 font-mono text-[#A79798]">{alumni.phone || '-'}</td>
                        <td className="p-3.5 font-mono text-[#E08A17]">{alumni.batch_year || '-'}</td>
                        <td className="p-3.5 text-[#A79798]">{alumni.place || '-'}</td>
                        <td className="p-3.5 text-[#A79798]">{alumni.current_organization || '-'}</td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <button onClick={() => editManagedUser(alumni)} title="Edit alumni details" className="p-1.5 text-[#E08A17] hover:text-[#F7F2F2]"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => deleteManagedUser(alumni)} title="Delete alumni" className="p-1.5 text-[#E01B22] hover:text-[#FF2A2A]"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: POWER PERSONNEL (Coordinators & Admins Roster + Creation) */}
        {activeTab === 'POWER_PEOPLE' && (
          <div className="space-y-8">
            {/* Create Official / Power User Form */}
            <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-4">
              <h2 className="text-lg font-display font-bold text-[#F7F2F2] flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#E01B22]" /> ADD NEW DESK OFFICIAL / COORDINATOR
              </h2>
              <form onSubmit={handleCreateUser} className="space-y-4 text-xs font-body">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#A79798] mb-1 font-semibold">Full Name *</label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="e.g. Swarna Rathna A"
                      required
                      className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A79798] mb-1 font-semibold">Email Address *</label>
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="e.g. 25mx127@psgtech.ac.in"
                      required
                      className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A79798] mb-1 font-semibold">Phone Number</label>
                    <input
                      type="text"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      placeholder="e.g. 9952873426"
                      className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[#A79798] mb-1 font-semibold">Password *</label>
                    <input
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A79798] mb-1 font-semibold">Role *</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none font-mono"
                    >
                      <option value="event_coordinator">event_coordinator</option>
                      <option value="admin">admin</option>
                      <option value="student">student</option>
                      {isSuperAdmin && (
                        <>
                          <option value="junior_attendance">junior_attendance</option>
                          <option value="special_user">special_user</option>
                          <option value="super_admin">super_admin</option>
                          <option value="admin_power">admin_power</option>
                        </>
                      )}
                    </select>
                  </div>
                  {newUserRole === 'event_coordinator' && (
                    <div>
                      <label className="block text-[#A79798] mb-1 font-semibold">Assigned Event *</label>
                      <select
                        value={newUserEventId}
                        onChange={(e) => setNewUserEventId(e.target.value)}
                        required
                        className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none font-mono"
                      >
                        <option value="">Select one event</option>
                        {events.map((event) => (
                          <option key={event.id} value={event.id}>{event.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-[#A79798] mb-1 font-semibold">College</label>
                    <input
                      type="text"
                      value={newUserCollege}
                      onChange={(e) => setNewUserCollege(e.target.value)}
                      className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A79798] mb-1 font-semibold">Department</label>
                    <input
                      type="text"
                      value={newUserDepartment}
                      onChange={(e) => setNewUserDepartment(e.target.value)}
                      className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creatingUser}
                  className="px-6 py-2.5 bg-[#E01B22] hover:bg-[#FF2A2A] disabled:opacity-50 text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> {creatingUser ? 'SAVING...' : 'SAVE & STORE OFFICIAL IN DATABASE'}
                </button>
              </form>
            </div>

            {/* Power Personnel Table */}
            <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-6">
              <h2 className="text-lg font-display font-bold text-[#F7F2F2]">
                AUTHORIZED POWER PERSONNEL &amp; COORDINATORS ({powerUsers.length})
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-body">
                  <thead className="bg-[#0A0607] text-[#6B5A5C] font-mono border-b border-[#3E2529]">
                    <tr>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">NAME &amp; EMAIL</th>
                      <th className="p-3.5">DEPARTMENT</th>
                      <th className="p-3.5">ASSIGNED EVENT</th>
                      <th className="p-3.5">ASSIGNED ROLE</th>
                      <th className="p-3.5">CHANGE ROLE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A1A1D]">
                    {powerUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#1A1114] transition-colors">
                        <td className="p-3.5 font-mono text-[#6B5A5C]">#{u.id}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-[#F7F2F2]">{u.name}</div>
                          <div className="text-[10px] text-[#A79798] font-mono">{u.email} &bull; {u.phone || '-'}</div>
                        </td>
                        <td className="p-3.5 font-mono text-[#A79798]">{u.department || 'Computer Applications'}</td>
                        <td className="p-3.5 font-mono text-[#E08A17]">
                          {u.role === 'event_coordinator'
                            ? (u.eventAssignments?.[0]?.event?.name || 'Unassigned')
                            : '-'}
                        </td>
                        <td className="p-3.5 font-mono text-[#FF2A2A] font-bold uppercase">{u.role}</td>
                        <td className="p-3.5">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] px-2.5 py-1 rounded-[2px] text-xs font-mono outline-none"
                          >
                            <option value="event_coordinator">event_coordinator</option>
                            <option value="admin">admin</option>
                            <option value="student">student</option>
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
          </div>
        )}

        {/* TAB 4: SYMPOSIUM TELEMETRY & ATTENDANCE DASHBOARD */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* Top KPI Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#130C0E] border border-[#2A1A1D] p-5 rounded-[2px]">
                <span className="mono-label text-[#A79798] block">REGISTERED STUDENTS</span>
                <strong className="text-2xl font-mono text-[#F7F2F2] mt-1 block">{totalStudents}</strong>
                <span className="text-[10px] text-[#A79798] font-mono">Symposium accounts</span>
              </div>
              <div className="bg-[#130C0E] border border-[#1FA971]/40 p-5 rounded-[2px]">
                <span className="mono-label text-[#1FA971] block">PAYMENTS VERIFIED</span>
                <strong className="text-2xl font-mono text-[#1FA971] mt-1 block">{verifiedPaymentsCount}</strong>
                <span className="text-[10px] text-[#A79798] font-mono">₹{verifiedPaymentsCount * 150} INR collected</span>
              </div>
              <div className="bg-[#130C0E] border border-[#E08A17]/40 p-5 rounded-[2px]">
                <span className="mono-label text-[#E08A17] block">ARENA ENROLLMENTS</span>
                <strong className="text-2xl font-mono text-[#E08A17] mt-1 block">{totalEnrollments}</strong>
                <span className="text-[10px] text-[#A79798] font-mono">Across 11 competition arenas</span>
              </div>
              <div className="bg-[#130C0E] border border-[#E01B22]/40 p-5 rounded-[2px]">
                <span className="mono-label text-[#E01B22] block">OVERALL ATTENDANCE</span>
                <strong className="text-2xl font-mono text-[#FF2A2A] mt-1 block">{overallAttendancePercentage}%</strong>
                <span className="text-[10px] text-[#A79798] font-mono">{totalAttended} of {totalEnrollments} checked in</span>
              </div>
            </div>

            {/* Arena Enrollment & Attendance Rate Breakdown */}
            <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-4">
              <h3 className="font-display font-bold text-base text-[#F7F2F2]">ARENA ENROLLMENT &amp; ATTENDANCE TELEMETRY</h3>
              
              <div className="space-y-3">
                {allRegistrations.map((eg) => {
                  const total = eg.registrations.length;
                  const present = eg.registrations.filter((r: any) => r.attended || r.attendance_status === 'PRESENT').length;
                  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

                  return (
                    <div key={eg.eventId} className="bg-[#0A0607] border border-[#2A1A1D] p-3.5 rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
                      <div className="flex-1">
                        <span className="font-bold text-[#F7F2F2] block">{eg.eventName}</span>
                        <div className="w-full bg-[#1A1114] h-2 rounded-full mt-2 overflow-hidden">
                          <div
                            className="bg-[#E01B22] h-full transition-all"
                            style={{ width: `${Math.min(100, (total / 100) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0 text-right">
                        <div>
                          <span className="text-[#A79798] block text-[10px]">ENROLLED</span>
                          <strong className="text-[#E08A17]">{total}</strong>
                        </div>
                        <div>
                          <span className="text-[#A79798] block text-[10px]">PRESENT</span>
                          <strong className="text-[#1FA971]">{present}</strong>
                        </div>
                        <div>
                          <span className="text-[#A79798] block text-[10px]">RATE</span>
                          <strong className="text-[#FF2A2A]">{pct}%</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BROADCAST ANNOUNCEMENTS */}
        {activeTab === 'ANNOUNCEMENTS' && (
          <div className="space-y-8">
            <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-4">
              <h2 className="text-lg font-display font-bold text-[#F7F2F2] flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#E01B22]" /> BROADCAST MESSAGE TO ALL COORDINATORS &amp; ADMINS
              </h2>
              <p className="text-xs text-[#A79798] font-mono">
                Dispatches an announcement notice to the platform ticker and automatically sends an official email to all coordinators and admin staff.
              </p>

              <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs font-body">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[#A79798] mb-1 font-semibold">Title Tag *</label>
                    <input
                      type="text"
                      value={newAnnoTitle}
                      onChange={(e) => setNewAnnoTitle(e.target.value)}
                      placeholder="e.g. COORDINATOR BRIEFING AT 09:00 AM"
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
                    placeholder="Enter broadcast instructions..."
                    required
                    className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none h-24"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] flex items-center gap-2 shadow-lg"
                >
                  <Radio className="w-4 h-4" /> DISPATCH BROADCAST &amp; EMAIL OFFICIALS
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

        {/* TAB 6: EVENT MANAGEMENT */}
        {activeTab === 'EVENTS' && (
          <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-6">
            <div>
              <h2 className="text-lg font-display font-bold text-[#F7F2F2]">EVENT MANAGEMENT ({events.length})</h2>
              <p className="text-xs text-[#A79798] font-mono mt-1">Updating an event venue or time automatically emails all enrolled participants.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-body">
                <thead className="bg-[#0A0607] text-[#6B5A5C] font-mono border-b border-[#3E2529]">
                  <tr>
                    <th className="p-3.5">EVENT NAME</th>
                    <th className="p-3.5">CATEGORY</th>
                    <th className="p-3.5">DAY &amp; DATE</th>
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
                          className="px-3.5 py-1.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono font-bold text-[10px] rounded-[2px]"
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
              placeholder="e.g. Invalid transaction reference / UTR not found on bank statement..."
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

export default AdminPage;

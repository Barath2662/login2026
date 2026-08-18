import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Loader2, ShieldAlert, UserCheck } from 'lucide-react';
import { GlitchText } from '../../components/ui/GlitchText';

const SuperAdminAccess = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    setUpdating(userId);
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter(u => {
    // Show only seeded users by default, or anyone matching the search
    if (!search) return u.email.endsWith('@psgtech.ac.in');
    
    return u.email.toLowerCase().includes(search.toLowerCase()) || 
           u.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <GlitchText as="h1" className="text-3xl font-mono font-bold uppercase tracking-widest text-color-danger mb-2">
          Super Admin <span className="text-white">Override</span>
        </GlitchText>
        <p className="text-text-secondary font-mono text-sm">
          Modify global system access privileges.
        </p>
      </div>

      <div className="mb-6 p-4 bg-color-danger/10 border border-color-danger/30 rounded-sm flex gap-3 items-start">
        <ShieldAlert className="text-color-danger mt-1" size={20} />
        <div>
          <div className="text-color-danger font-bold font-mono uppercase tracking-wider mb-1">OMEGA LEVEL CLEARANCE</div>
          <div className="text-sm text-text-secondary">You have access to critical authorization controls. With great power comes great responsibility.</div>
        </div>
      </div>

      <div className="bg-bg-card border border-border-color rounded-sm p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Access Control Matrix</h2>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black/50 border border-border-color/50 px-4 py-2 text-white font-mono text-sm rounded-sm focus:border-color-danger outline-none"
          />
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 size={32} className="animate-spin text-color-danger" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-color text-text-muted text-xs font-mono uppercase tracking-wider">
                  <th className="p-3">Operative</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Re-Assign Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color/50">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-white text-sm">{u.name}</td>
                    <td className="p-3 text-text-secondary text-sm">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-mono border ${
                        (u.role === 'super_admin' || u.role === 'admin_power') ? 'bg-color-danger/20 border-color-danger text-color-danger' : 
                        u.role === 'admin' ? 'bg-color-red/20 border-color-red text-white' : 
                        'bg-border-color/30 border-transparent text-text-secondary'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        disabled={updating === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-black border border-border-color text-white text-sm font-mono px-3 py-1.5 rounded-sm focus:border-color-danger outline-none disabled:opacity-50"
                      >
                        <option value="student">Student</option>
                        <option value="event_coordinator">Event Coordinator</option>
                        <option value="junior_attendance">Junior Attendance</option>
                        <option value="special_user">Special User</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="admin_power">Admin Power</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminAccess;

import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, UserX, UserCheck, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/users/');
      setUsers(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/users/${userId}/status`, { is_active: !currentStatus });
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Failed to toggle status:', err);
      alert('Failed to update user status.');
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (u.roll_no?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (u.id?.toString().includes(searchQuery))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <GlitchText as="h1" className="text-3xl font-mono font-bold uppercase tracking-widest text-white mb-2">
            Global <span className="text-color-silver">Users</span>
          </GlitchText>
          <p className="text-text-secondary font-mono text-sm">
            Master roster of all registered operatives across the system.
          </p>
        </div>
      </div>

      <div className="bg-bg-card border border-border-color rounded-sm shadow-xl overflow-hidden">
        <div className="p-4 border-b border-border-color bg-black/20">
          <div className="relative max-w-md">
            <Input 
              placeholder="Search by Name, Roll No, or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/50 border-color-silver/30 focus:border-color-silver"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-secondary whitespace-nowrap">
            <thead className="text-xs uppercase bg-black/40 text-text-primary border-b border-border-color">
              <tr>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Operative ID / Name</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Institution</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Department</th>
                <th className="px-6 py-4 text-right font-mono font-bold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`hover:bg-white/5 transition-colors ${!user.is_active ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{user.name || 'UNKNOWN'}</div>
                    <div className="text-xs text-text-muted font-mono">{user.id} / {user.roll_no || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">{user.college_name || 'N/A'}</td>
                  <td className="px-6 py-4">{user.department || 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
                    {user.is_active ? (
                      <Button 
                        onClick={() => handleToggleStatus(user.id, user.is_active)}
                        variant="outline" 
                        size="sm" 
                        className="border-color-danger text-color-danger hover:bg-color-danger hover:text-black h-8 px-3 text-xs"
                      >
                        <UserX size={14} className="mr-1" /> BAN
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleToggleStatus(user.id, user.is_active)}
                        variant="outline" 
                        size="sm" 
                        className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black h-8 px-3 text-xs"
                      >
                        <UserCheck size={14} className="mr-1" /> UNBAN
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

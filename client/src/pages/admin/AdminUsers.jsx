import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, UserX, UserCheck, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userCategory, setUserCategory] = useState('ALL'); // 'ALL' | 'PARTICIPANT' | 'ALUMNI'
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

  const filteredUsers = users.filter(u => {
    const isAlumni = u.user_type === 'ALUMNI';
    const matchesCategory = 
      userCategory === 'ALL' ? true :
      userCategory === 'ALUMNI' ? isAlumni :
      !isAlumni;

    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (u.name?.toLowerCase().includes(query) || '') ||
      (u.email?.toLowerCase().includes(query) || '') ||
      (u.roll_no?.toLowerCase().includes(query) || '') ||
      (u.batch_year?.toString().includes(query) || '') ||
      (u.current_organization?.toLowerCase().includes(query) || '') ||
      (u.place?.toLowerCase().includes(query) || '') ||
      (u.id?.toString().includes(query));

    return matchesCategory && matchesSearch;
  });

  const alumniCount = users.filter(u => u.user_type === 'ALUMNI').length;
  const participantCount = users.length - alumniCount;

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
            User <span className="text-color-silver">Management</span> & Roster
          </GlitchText>
          <p className="text-text-secondary font-mono text-sm">
            Manage system access for student participants and view visiting Alumni records.
          </p>
        </div>
      </div>

      <div className="bg-bg-card border border-border-color rounded-sm shadow-xl overflow-hidden">
        {/* Search & Category Filter Header */}
        <div className="p-4 border-b border-border-color bg-black/20 flex flex-wrap items-center justify-between gap-4">
          <div className="relative max-w-md flex-1">
            <Input 
              placeholder="Search by Name, Roll No, Batch, Company, or Email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/50 border-color-silver/30 focus:border-color-silver text-xs font-mono"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setUserCategory('ALL')}
              className={`px-3 py-1.5 rounded-sm border transition-colors ${
                userCategory === 'ALL'
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-black/40 text-text-secondary border-border-color hover:border-text-secondary'
              }`}
            >
              ALL USERS ({users.length})
            </button>
            <button
              onClick={() => setUserCategory('PARTICIPANT')}
              className={`px-3 py-1.5 rounded-sm border transition-colors ${
                userCategory === 'PARTICIPANT'
                  ? 'bg-[#E01B24] text-white border-[#E01B24] font-bold'
                  : 'bg-black/40 text-text-secondary border-border-color hover:border-text-secondary'
              }`}
            >
              STUDENTS ({participantCount})
            </button>
            <button
              onClick={() => setUserCategory('ALUMNI')}
              className={`px-3 py-1.5 rounded-sm border transition-colors ${
                userCategory === 'ALUMNI'
                  ? 'bg-[#E8A317] text-black border-[#E8A317] font-bold'
                  : 'bg-black/40 text-[#E8A317] border-[#E8A317]/40 hover:bg-[#E8A317]/10'
              }`}
            >
              ALUMNI ATTENDEES ({alumniCount})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-secondary whitespace-nowrap">
            <thead className="text-xs uppercase bg-black/40 text-text-primary border-b border-border-color">
              <tr>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Type</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Name & Contact</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Institution / Company</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Roll / Batch Year</th>
                <th className="px-6 py-4 text-right font-mono font-bold tracking-wider">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filteredUsers.map((user) => {
                const isAlumni = user.user_type === 'ALUMNI';
                return (
                  <tr key={user.id} className={`hover:bg-white/5 transition-colors ${!user.is_active ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-sm border ${
                        isAlumni 
                          ? 'bg-[#E8A317]/10 text-[#E8A317] border-[#E8A317]/40'
                          : 'bg-color-red/10 text-color-red border-color-red/30'
                      }`}>
                        {isAlumni ? 'ALUMNI' : 'STUDENT'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{user.name || 'UNKNOWN'}</div>
                      <div className="text-xs text-text-muted font-mono">{user.email} {user.phone ? `• ${user.phone}` : ''}</div>
                    </td>
                    <td className="px-6 py-4">
                      {isAlumni ? (
                        <div>
                          <div className="text-white font-medium">{user.current_organization || 'N/A'}</div>
                          <div className="text-xs text-text-muted font-mono">{user.place || 'Location N/A'}</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-white font-medium">{user.college_name || 'N/A'}</div>
                          <div className="text-xs text-text-muted font-mono">{user.department || 'N/A'}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {isAlumni ? (
                        <span className="text-[#E8A317] font-bold">Batch of {user.batch_year || 'N/A'}</span>
                      ) : (
                        <span>{user.roll_no || 'N/A'} ({user.year_of_study || 'N/A'})</span>
                      )}
                    </td>
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
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-black h-8 px-3 text-xs"
                        >
                          <UserCheck size={14} className="mr-1" /> UNBAN
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

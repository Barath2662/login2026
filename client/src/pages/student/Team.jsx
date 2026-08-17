import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, UserPlus, Check, X, Shield, Users, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../services/api';

const Team = () => {
  const [activeTab, setActiveTab] = useState('FIND');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myTeam, setMyTeam] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [studentsRes, requestsRes, myTeamRes] = await Promise.allSettled([
          api.get('/teams/students'),
          api.get('/teams/requests'),
          api.get('/teams/my')
        ]);
        
        if (studentsRes.status === 'fulfilled') {
          setStudents(Array.isArray(studentsRes.value.data) ? studentsRes.value.data : (studentsRes.value.data.data || []));
        }
        
        if (requestsRes.status === 'fulfilled') {
          setRequests(Array.isArray(requestsRes.value.data) ? requestsRes.value.data : (requestsRes.value.data.data || []));
        }
        
        if (myTeamRes.status === 'fulfilled' && myTeamRes.value.data) {
          setMyTeam(myTeamRes.value.data);
        }
      } catch (err) {
        console.error('Failed to fetch team data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredStudents = students.filter(student => 
    (student.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (student.college_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (student.department?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendRequest = async (id) => {
    try {
      if (!myTeam) {
        // Create team first if user doesn't have one
        const { data: newTeam } = await api.post('/teams/', { studentId: id, name: `Squad-${Math.floor(Math.random()*1000)}` });
        setMyTeam(newTeam);
        alert('Squad formed and invite sent!');
      } else {
        await api.post('/teams/requests', { receiver_id: id, team_id: myTeam.id });
        alert('Invite sent!');
      }
      
      // Update local state to reflect sent request
      setStudents(prev => prev.map(s => s.id === id ? { ...s, invite_sent: true } : s));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request.');
    }
  };

  const handleRequestAction = async (id, action) => {
    try {
      await api.put(`/teams/requests/${id}`, { status: action.toLowerCase() });
      setRequests(prev => prev.filter(req => req.id !== id));
      if (action === 'ACCEPT') {
        // Refresh team if accepted
        const { data } = await api.get('/teams/my');
        setMyTeam(data);
      }
    } catch (err) {
      alert('Failed to update request.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 relative min-h-[80vh]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-color-red/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-color-red/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-10 text-center relative z-10">
        <GlitchText as="h1" className="text-4xl md:text-5xl font-mono font-bold uppercase tracking-widest text-white mb-4">
          Squad <span className="text-color-red">Formation</span>
        </GlitchText>
        <p className="text-text-secondary max-w-2xl mx-auto font-mono text-sm">
          Forge alliances to survive the Multiverse. Search the registry for available operatives or review incoming squad requests.
        </p>
      </div>

      <div className="relative z-10 bg-bg-card border border-border-color rounded-sm shadow-2xl overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-border-color">
          <button
            onClick={() => setActiveTab('FIND')}
            className={`flex-1 py-4 px-6 text-sm font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'FIND' 
                ? 'bg-color-red/10 text-color-red border-b-2 border-color-red' 
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            <Search size={16} />
            Find Operatives
          </button>
          <button
            onClick={() => setActiveTab('REQUESTS')}
            className={`flex-1 py-4 px-6 text-sm font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'REQUESTS' 
                ? 'bg-color-red/10 text-color-red border-b-2 border-color-red' 
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            <Shield size={16} />
            Incoming Requests
            {requests.length > 0 && (
              <span className="ml-2 bg-color-red text-black text-xs px-2 py-0.5 rounded-full font-bold">
                {requests.length}
              </span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* FIND TAB */}
            {activeTab === 'FIND' && (
              <motion.div
                key="find"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="relative max-w-xl mx-auto mb-10">
                  <Input 
                    placeholder="Search by Name, College, or Department..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 bg-black/50 border-color-red/30 focus:border-color-red h-14"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                </div>

                <div className="overflow-x-auto rounded-sm border border-border-color">
                  <table className="w-full text-left text-sm text-text-secondary">
                    <thead className="text-xs uppercase bg-black/40 text-text-primary border-b border-border-color">
                      <tr>
                        <th className="px-6 py-4 font-mono font-bold tracking-wider">Operative</th>
                        <th className="px-6 py-4 font-mono font-bold tracking-wider">Origin (College)</th>
                        <th className="px-6 py-4 font-mono font-bold tracking-wider">Sector (Dept)</th>
                        <th className="px-6 py-4 text-right font-mono font-bold tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-white">{student.name}</div>
                              <div className="text-xs text-text-muted font-mono mt-1">UID: {student.id}</div>
                            </td>
                            <td className="px-6 py-4">{student.college_name || 'N/A'}</td>
                            <td className="px-6 py-4">{student.department || 'N/A'}</td>
                            <td className="px-6 py-4 text-right">
                              {student.invite_sent ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-color-silver px-3 py-1.5 bg-color-silver/10 rounded-sm border border-color-silver/30">
                                  <Check size={14} /> SENT
                                </span>
                              ) : (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleSendRequest(student.id)}
                                  className="h-8 px-4 text-xs tracking-wider flex items-center gap-2 ml-auto"
                                >
                                  <UserPlus size={14} /> ENLIST
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-text-muted">
                            <Users size={32} className="mx-auto mb-3 opacity-20" />
                            <p>No operatives found matching the search criteria.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* REQUESTS TAB */}
            {activeTab === 'REQUESTS' && (
              <motion.div
                key="requests"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {requests.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {requests.map(req => (
                      <div key={req.id} className="bg-black/40 border border-border-color p-5 rounded-sm flex flex-col sm:flex-row gap-4 items-center justify-between hover:border-color-red/50 transition-colors group">
                        <div className="text-center sm:text-left">
                          <div className="text-sm text-text-muted font-mono mb-1">INCOMING TRANSMISSION</div>
                          <div className="font-bold text-white text-lg">Team ID: {req.team_id}</div>
                          <div className="text-xs text-color-red font-mono tracking-widest mt-1">REQ ID: {req.id}</div>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                          <button 
                            onClick={() => handleRequestAction(req.id, 'REJECT')}
                            className="flex-1 sm:flex-none flex justify-center items-center h-10 w-10 rounded-sm border border-color-danger text-color-danger hover:bg-color-danger hover:text-black transition-colors"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                          <button 
                            onClick={() => handleRequestAction(req.id, 'ACCEPT')}
                            className="flex-1 sm:flex-none flex justify-center items-center h-10 w-10 rounded-sm bg-color-red text-black hover:bg-white hover:text-black transition-colors"
                            title="Accept"
                          >
                            <Check size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Shield size={48} className="mx-auto mb-4 text-text-muted opacity-20" />
                    <p className="text-text-secondary text-lg">No incoming squad requests.</p>
                    <p className="text-text-muted text-sm mt-2">Your comms channel is clear.</p>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Team;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Users, Plus, Send, UserPlus, Check, X, Crown, Search, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

// ──────────────────────────────────────────────
// Create Team Modal
// ──────────────────────────────────────────────
const CreateTeamModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [eventId, setEventId] = useState('');
  const [error, setError] = useState('');

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => { const res = await api.events.getAll(); return res.data || []; },
  });

  const teamEvents = events.filter((e: any) => e.team_type === 'TEAM' && e.status === 'open');

  const createMutation = useMutation({
    mutationFn: async () => await api.teams.create({ name, event_id: Number(eventId) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-teams'] });
      onClose();
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Failed to create team'),
  });

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#130C0E] border border-[#2A1A1D] rounded-[2px] w-full max-w-md p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-display font-bold text-[#F7F2F2]">Create Team</h2>

        {error && (
          <div className="bg-[#9B0A12]/20 border border-[#E01B22]/60 p-2 rounded-[2px] text-xs text-[#FF2A2A] flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" />{error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[#A79798] mb-1 font-semibold">Team Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Code Warriors"
              className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3 py-2.5 text-[#F7F2F2] text-xs outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-[#A79798] mb-1 font-semibold">Event *</label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3 py-2.5 text-[#F7F2F2] text-xs outline-none"
            >
              <option value="">Select an event</option>
              {teamEvents.map((e: any) => (
                <option key={e.id} value={e.id}>{e.name} ({e.min_team_size}-{e.max_team_size} members)</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-xs font-mono text-[#A79798] hover:text-white transition-colors">Cancel</button>
          <button
            onClick={() => createMutation.mutate()}
            disabled={!name.trim() || !eventId || createMutation.isPending}
            className="px-5 py-2 bg-[#E01B22] hover:bg-[#FF2A2A] text-white text-xs font-mono font-bold rounded-[2px] disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Team'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Invite Member Modal
// ──────────────────────────────────────────────
const InviteModal: React.FC<{ teamId: number; onClose: () => void }> = ({ teamId, onClose }) => {
  const queryClient = useQueryClient();
  const [loginId, setLoginId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const inviteMutation = useMutation({
    mutationFn: async () => await api.teams.inviteMember(teamId, loginId.toUpperCase().trim()),
    onSuccess: () => {
      setSuccess(`Invitation sent to ${loginId.toUpperCase()}`);
      setError('');
      setLoginId('');
      queryClient.invalidateQueries({ queryKey: ['my-teams'] });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to send invitation');
      setSuccess('');
    },
  });

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#130C0E] border border-[#2A1A1D] rounded-[2px] w-full max-w-md p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-display font-bold text-[#F7F2F2]">Invite Member</h2>
        <p className="text-xs text-[#6B5A5C] font-mono">Enter the participant's LOGIN ID to send an invitation</p>

        {error && <div className="bg-[#9B0A12]/20 border border-[#E01B22]/60 p-2 rounded-[2px] text-xs text-[#FF2A2A] flex items-center gap-2"><AlertCircle className="w-3.5 h-3.5" />{error}</div>}
        {success && <div className="bg-[#1FA971]/15 border border-[#1FA971]/60 p-2 rounded-[2px] text-xs text-[#1FA971] flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" />{success}</div>}

        <div className="flex gap-2">
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value.toUpperCase())}
            placeholder="LOGIN101"
            className="flex-1 bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3 py-2.5 text-[#F7F2F2] text-sm font-mono tracking-wider outline-none"
          />
          <button
            onClick={() => inviteMutation.mutate()}
            disabled={!loginId.trim() || inviteMutation.isPending}
            className="px-4 py-2 bg-[#E01B22] hover:bg-[#FF2A2A] text-white text-xs font-mono font-bold rounded-[2px] disabled:opacity-50 flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />{inviteMutation.isPending ? '...' : 'Send'}
          </button>
        </div>

        <button onClick={onClose} className="w-full text-xs font-mono text-[#6B5A5C] hover:text-white py-2">Close</button>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Main Teams Page
// ──────────────────────────────────────────────
export const MyTeamsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [inviteTeamId, setInviteTeamId] = useState<number | null>(null);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: myTeams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ['my-teams'],
    queryFn: async () => { const res = await api.teams.getMyTeams(); return res.data || []; },
  });

  const { data: myInvitations = [], isLoading: invLoading } = useQuery({
    queryKey: ['my-invitations'],
    queryFn: async () => { const res = await api.teams.getMyInvitations(); return res.data || []; },
  });

  const { data: myJoinRequests = [] } = useQuery({
    queryKey: ['my-join-requests'],
    queryFn: async () => { const res = await api.teams.getMyJoinRequests(); return res.data || []; },
  });

  const respondInvitationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'accepted' | 'declined' }) => await api.teams.respondToInvitation(id, status),
    onSuccess: (_, vars) => {
      setActionMsg({ type: 'success', text: `Invitation ${vars.status}` });
      queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['my-teams'] });
      setTimeout(() => setActionMsg(null), 3000);
    },
    onError: (err: any) => setActionMsg({ type: 'error', text: err.response?.data?.message || 'Action failed' }),
  });

  const respondJoinRequestMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'accepted' | 'rejected' }) => await api.teams.respondToJoinRequest(id, status),
    onSuccess: (_, vars) => {
      setActionMsg({ type: 'success', text: `Join request ${vars.status}` });
      queryClient.invalidateQueries({ queryKey: ['my-join-requests'] });
      queryClient.invalidateQueries({ queryKey: ['my-teams'] });
      setTimeout(() => setActionMsg(null), 3000);
    },
    onError: (err: any) => setActionMsg({ type: 'error', text: err.response?.data?.message || 'Action failed' }),
  });

  const isLoading = teamsLoading || invLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-[#F7F2F2]">My Teams</h1>
          <p className="text-xs text-[#6B5A5C] font-mono mt-1">Create teams, invite members, manage join requests</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#E01B22] hover:bg-[#FF2A2A] text-white text-[11px] font-mono font-bold rounded-[2px] flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />CREATE TEAM
        </button>
      </div>

      {/* Action Messages */}
      {actionMsg && (
        <div className={`p-3 rounded-[2px] flex items-center gap-2 text-xs ${
          actionMsg.type === 'success' ? 'bg-[#1FA971]/15 border border-[#1FA971]/60 text-[#1FA971]' : 'bg-[#9B0A12]/20 border border-[#E01B22]/60 text-[#FF2A2A]'
        }`}>
          {actionMsg.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          {actionMsg.text}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12"><Loader2 className="w-6 h-6 text-[#E01B22] animate-spin mx-auto" /></div>
      ) : (
        <>
          {/* Pending Invitations */}
          {myInvitations.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-display font-bold text-[#E08A17] flex items-center gap-2">
                <UserPlus className="w-4 h-4" />Pending Invitations ({myInvitations.length})
              </h2>
              <div className="space-y-2">
                {myInvitations.map((inv: any) => (
                  <div key={inv.id} className="bg-[#130C0E] border border-[#E08A17]/30 rounded-[2px] p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-[#F7F2F2] font-bold">{inv.team?.name}</p>
                      <p className="text-[10px] font-mono text-[#6B5A5C] mt-0.5">
                        {inv.team?.event?.name} • Invited by {inv.sender?.login_id} ({inv.sender?.name})
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => respondInvitationMutation.mutate({ id: inv.id, status: 'accepted' })}
                        disabled={respondInvitationMutation.isPending}
                        className="px-3 py-1.5 bg-[#1FA971]/15 text-[#1FA971] border border-[#1FA971]/30 text-[10px] font-mono font-bold rounded-[2px] hover:bg-[#1FA971]/25 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />Accept
                      </button>
                      <button
                        onClick={() => respondInvitationMutation.mutate({ id: inv.id, status: 'declined' })}
                        disabled={respondInvitationMutation.isPending}
                        className="px-3 py-1.5 bg-[#4A050A]/30 text-[#FF2A2A] border border-[#E01B22]/30 text-[10px] font-mono font-bold rounded-[2px] hover:bg-[#4A050A]/50 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Join Requests (for my teams) */}
          {myJoinRequests.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-display font-bold text-[#6366F1] flex items-center gap-2">
                <Send className="w-4 h-4" />Join Requests ({myJoinRequests.length})
              </h2>
              <div className="space-y-2">
                {myJoinRequests.map((req: any) => (
                  <div key={req.id} className="bg-[#130C0E] border border-[#6366F1]/30 rounded-[2px] p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-[#F7F2F2]">
                        <span className="font-bold text-[#6366F1]">{req.sender?.login_id}</span> ({req.sender?.name}) wants to join{' '}
                        <span className="font-bold">{req.team?.name}</span>
                      </p>
                      <p className="text-[10px] font-mono text-[#6B5A5C] mt-0.5">{req.team?.event?.name} • {req.sender?.college_name}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => respondJoinRequestMutation.mutate({ id: req.id, status: 'accepted' })}
                        disabled={respondJoinRequestMutation.isPending}
                        className="px-3 py-1.5 bg-[#1FA971]/15 text-[#1FA971] border border-[#1FA971]/30 text-[10px] font-mono font-bold rounded-[2px] hover:bg-[#1FA971]/25 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />Accept
                      </button>
                      <button
                        onClick={() => respondJoinRequestMutation.mutate({ id: req.id, status: 'rejected' })}
                        disabled={respondJoinRequestMutation.isPending}
                        className="px-3 py-1.5 bg-[#4A050A]/30 text-[#FF2A2A] border border-[#E01B22]/30 text-[10px] font-mono font-bold rounded-[2px] hover:bg-[#4A050A]/50 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Teams */}
          <div className="space-y-3">
            <h2 className="text-sm font-display font-bold text-[#F7F2F2] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#E01B22]" />My Teams
            </h2>

            {myTeams.length === 0 && myInvitations.length === 0 ? (
              <div className="bg-[#130C0E] border border-[#2A1A1D] rounded-[2px] p-12 text-center space-y-3">
                <Users className="w-10 h-10 text-[#2A1A1D] mx-auto" />
                <p className="text-xs font-mono text-[#6B5A5C]">No teams yet. Create one or browse events to join.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myTeams.map((membership: any) => {
                  const team = membership.team;
                  if (!team) return null;

                  const members = team.members || [];
                  const isLeader = membership.role === 'leader';

                  return (
                    <div key={team.id} className="bg-[#130C0E] border border-[#2A1A1D] rounded-[2px] p-5 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-display font-bold text-[#F7F2F2]">{team.name}</h3>
                            {isLeader && (
                              <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold bg-[#E08A17]/15 text-[#E08A17] border border-[#E08A17]/30 rounded-[2px] flex items-center gap-0.5">
                                <Crown className="w-2.5 h-2.5" />LEADER
                              </span>
                            )}
                            <span className={`px-1.5 py-0.5 text-[8px] font-mono font-bold rounded-[2px] ${
                              team.status === 'registered' ? 'bg-[#1FA971]/15 text-[#1FA971] border border-[#1FA971]/30' :
                              team.status === 'forming' ? 'bg-[#E08A17]/15 text-[#E08A17] border border-[#E08A17]/30' :
                              'bg-[#4A050A]/30 text-[#FF2A2A] border border-[#E01B22]/30'
                            }`}>
                              {team.status?.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-[#6B5A5C] mt-1">{team.event?.name || 'Event'}</p>
                        </div>

                        {isLeader && team.status === 'forming' && (
                          <button
                            onClick={() => setInviteTeamId(team.id)}
                            className="px-3 py-1.5 bg-[#E01B22]/15 text-[#E01B22] border border-[#E01B22]/30 text-[10px] font-mono font-bold rounded-[2px] hover:bg-[#E01B22]/25 flex items-center gap-1"
                          >
                            <UserPlus className="w-3 h-3" />Invite
                          </button>
                        )}
                      </div>

                      {/* Members List */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-[#6B5A5C] uppercase tracking-wider">Members ({members.length})</span>
                        {members.map((member: any) => (
                          <div key={member.id} className="flex items-center gap-3 bg-[#0A0607] px-3 py-2 rounded-[2px]">
                            <div className="w-6 h-6 rounded-full bg-[#1A1114] flex items-center justify-center text-[10px] font-bold text-[#A79798]">
                              {member.student?.name?.charAt(0) || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs text-[#F7F2F2] font-bold">{member.student?.name}</span>
                              <span className="text-[10px] font-mono text-[#E01B22] ml-2">{member.student?.login_id}</span>
                            </div>
                            <span className={`text-[9px] font-mono font-bold ${member.role === 'leader' ? 'text-[#E08A17]' : 'text-[#6B5A5C]'}`}>
                              {member.role?.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      {showCreateModal && <CreateTeamModal onClose={() => setShowCreateModal(false)} />}
      {inviteTeamId && <InviteModal teamId={inviteTeamId} onClose={() => setInviteTeamId(null)} />}
    </div>
  );
};

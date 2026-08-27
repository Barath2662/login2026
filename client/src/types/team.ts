import type { Event } from './event';
import type { User } from './user';

export type TeamStatus = 'forming' | 'registered' | 'disbanded';
export type MemberRole = 'leader' | 'member';
export type MemberStatus = 'pending' | 'accepted' | 'rejected' | 'left';
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';
export type JoinRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface TeamMember {
  id: number;
  team_id: number;
  student_id: number;
  role: MemberRole;
  status: MemberStatus;
  student?: Pick<User, 'id' | 'name' | 'login_id' | 'college_name' | 'department'>;
  createdAt?: string;
}

export interface Team {
  id: number;
  name: string;
  event_id: number;
  created_by: number;
  status: TeamStatus;
  event?: Event;
  creator?: Pick<User, 'id' | 'name' | 'login_id'>;
  members?: TeamMember[];
  invitations?: TeamInvitation[];
  joinRequests?: JoinRequest[];
  createdAt?: string;
}

export interface TeamInvitation {
  id: number;
  team_id: number;
  sender_id: number;
  receiver_id: number;
  status: InvitationStatus;
  team?: Team;
  sender?: Pick<User, 'id' | 'name' | 'login_id' | 'college_name'>;
  receiver?: Pick<User, 'id' | 'name' | 'login_id'>;
  createdAt?: string;
  expires_at?: string;
}

export interface JoinRequest {
  id: number;
  team_id: number;
  sender_id: number;
  receiver_id: number;
  status: JoinRequestStatus;
  team?: Team;
  sender?: Pick<User, 'id' | 'name' | 'login_id' | 'college_name' | 'department'>;
  createdAt?: string;
}

export interface TeamMembership {
  id: number;
  team_id: number;
  student_id: number;
  role: MemberRole;
  status: MemberStatus;
  team?: Team;
}

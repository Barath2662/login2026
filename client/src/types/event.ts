export type EventType = 'INDIVIDUAL' | 'TEAM';
export type EventCategory = 'TECHNICAL' | 'NON_TECHNICAL';
export type EventStatus = 'draft' | 'open' | 'closed' | 'completed' | 'cancelled';

export interface Event {
  id: number;
  name: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  venue: string | null;
  is_online: boolean;
  max_participants: number | null;
  category: EventCategory;
  team_type: EventType;
  min_team_size: number;
  max_team_size: number;
  day: number;
  registration_deadline: string | null;
  is_flagship: boolean;
  entry_fee: number;
  rules_url: string | null;
  status: EventStatus;
  coordinator_name: string | null;
  coordinator_phone: string | null;
  createdAt?: string;
}

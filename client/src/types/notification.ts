export interface ServerNotification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  createdAt: string;
}

export type NotificationType =
  | 'team_invitation'
  | 'invitation_response'
  | 'join_request'
  | 'join_request_response'
  | 'event_registration'
  | 'team_removal'
  | 'general';

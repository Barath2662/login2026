export interface User {
  id: number;
  login_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  college_name: string | null;
  department: string | null;
  roll_no: string | null;
  role: 'student' | 'event_coordinator' | 'junior_attendance' | 'special_user' | 'admin' | 'super_admin' | 'admin_power';
  user_type: 'PARTICIPANT' | 'ALUMNI' | 'STAFF';
  student_id_code: string | null;
  is_active: boolean;
  accommodation_required: boolean;
  must_change_password: boolean;
  hasPaidFee: boolean;
  registrations: { worldId: number }[];
  gender?: string | null;
  year_of_study?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  college_name: string;
  department: string;
  roll_no: string;
  user_type: 'PARTICIPANT' | 'ALUMNI';
  gender?: string;
  year_of_study?: string;
  batch_year?: string;
  place?: string;
  current_organization?: string;
  accommodation_required?: boolean;
}

export interface LoginPayload {
  loginId?: string;
  email?: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  loginId?: string;
  user: User;
}

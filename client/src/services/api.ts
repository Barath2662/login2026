import { axiosInstance } from './axios';

export const api = {
  getHealthStatus: async () => {
    const response = await axiosInstance.get<{ status: string }>('/health');
    return response.data;
  },
  
  // Generic methods
  get: async (url: string, params?: any) => await axiosInstance.get(url, { params }),
  post: async (url: string, data?: any) => await axiosInstance.post(url, data),
  put: async (url: string, data?: any) => await axiosInstance.put(url, data),
  delete: async (url: string) => await axiosInstance.delete(url),

  // 4.1 Auth Module
  auth: {
    register: async (data: any) => await axiosInstance.post('/auth/register', data),
    login: async (data: any) => await axiosInstance.post('/auth/login', data),
    logout: async () => await axiosInstance.post('/auth/logout')
  },

  // 4.2 User Management Module
  users: {
    profile: async () => await axiosInstance.get('/users/profile'),
    updateProfile: async (data: any) => await axiosInstance.put('/users/profile', data),
    getAll: async () => await axiosInstance.get('/users/'),
    getById: async (id: number | string) => await axiosInstance.get(`/users/${id}`),
    updateRole: async (id: number | string, role: string) => await axiosInstance.put(`/users/${id}/role`, { role }),
    updateStatus: async (id: number | string, is_active: boolean) => await axiosInstance.put(`/users/${id}/status`, { is_active })
  },

  // 4.3 Events Module
  events: {
    getAll: async () => await axiosInstance.get('/events/'),
    getCoordinatorEvents: async () => await axiosInstance.get('/events/coordinator/my'),
    getAdminEvents: async () => await axiosInstance.get('/events/admin/all'),
    getTimeline: async (date?: string) => await axiosInstance.get('/events/timeline', { params: { date } }),
    getDetails: async (id: number | string) => await axiosInstance.get(`/events/${id}`),
    create: async (data: any) => await axiosInstance.post('/events/', data),
    update: async (id: number | string, data: any) => await axiosInstance.put(`/events/${id}`, data),
    delete: async (id: number | string) => await axiosInstance.delete(`/events/${id}`),
    assignCoordinator: async (eventId: number | string, user_id: number) => await axiosInstance.post(`/events/${eventId}/coordinators`, { user_id })
  },

  // 4.4 Event Registration Module
  registrations: {
    register: async (event_id: number | string) => await axiosInstance.post('/registrations/', { event_id }),
    getMyRegistrations: async () => await axiosInstance.get('/registrations/my'),
    getEventRegistrations: async (eventId: number | string) => await axiosInstance.get(`/registrations/event/${eventId}`),
    cancel: async (id: number | string) => await axiosInstance.put(`/registrations/${id}/cancel`)
  },

  // 4.5 Payment Module
  payments: {
    getMyStatus: async () => await axiosInstance.get('/payments/my'),
    initiate: async (transaction_reference: string) => await axiosInstance.post('/payments/', { transaction_reference }),
    getAll: async () => await axiosInstance.get('/payments/'),
    verify: async (id: number | string) => await axiosInstance.put(`/payments/${id}/verify`),
    refund: async (id: number | string) => await axiosInstance.put(`/payments/${id}/refund`)
  },

  // 4.6 Team Formation Module
  teams: {
    listStudents: async (search?: string) => await axiosInstance.get('/teams/students', { params: { search } }),
    create: async (data: any) => await axiosInstance.post('/teams/', data),
    getMyTeam: async () => await axiosInstance.get('/teams/my'),
    sendInvitation: async (data: { receiver_id: number, team_id: number }) => await axiosInstance.post('/teams/requests', data),
    getRequests: async () => await axiosInstance.get('/teams/requests'),
    respondToRequest: async (id: number | string, status: string) => await axiosInstance.put(`/teams/requests/${id}`, { status })
  },

  // 4.7 Attendance Module
  attendance: {
    getEventList: async (eventId: number | string) => await axiosInstance.get(`/attendance/event/${eventId}`),
    mark: async (data: { event_id: number, student_id: number, status: string }) => await axiosInstance.post('/attendance/', data)
  },

  // 4.8 Bonafide Certificate Module
  bonafides: {
    getMyStatus: async () => await axiosInstance.get('/bonafides/my'),
    upload: async (file_url: string) => await axiosInstance.post('/bonafides/', { file_url }),
    verify: async (id: number | string, data: { status: string, remarks?: string }) => await axiosInstance.put(`/bonafides/${id}/verify`, data)
  },

  // 4.9 Notifications Module
  notifications: {
    getMy: async () => await axiosInstance.get('/notifications/'),
    markAsRead: async (id: number | string) => await axiosInstance.put(`/notifications/${id}/read`),
    create: async (data: { user_id: number, title: string, message: string, type?: string }) => await axiosInstance.post('/notifications/', data)
  },

  // 4.10 Competition Results Module
  results: {
    getEventResult: async (eventId: number | string) => await axiosInstance.get(`/results/event/${eventId}`),
    saveEventResult: async (eventId: number | string, data: any) => await axiosInstance.put(`/results/event/${eventId}`, data)
  },

  // 4.11 CSV Exports Module
  exports: {
    eventStudents: async (eventId: number | string) => await axiosInstance.get(`/exports/event/${eventId}/students`, { responseType: 'blob' }),
    attendance: async () => await axiosInstance.get('/exports/attendance', { responseType: 'blob' })
  }
};

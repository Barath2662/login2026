import { axiosInstance } from './axios';

// Abstract API Service Layer (Placeholder for future feature endpoints)
export const api = {
  getHealthStatus: async () => {
    const response = await axiosInstance.get<{ status: string }>('/health');
    return response.data;
  },
  get: async (url: string) => {
    return await axiosInstance.get(url);
  },
  post: async (url: string, data?: any) => {
    return await axiosInstance.post(url, data);
  },
};

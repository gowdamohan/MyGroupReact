import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  User,
  UserProfile,
  Country,
  State,
  District,
  Group,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ProfileUpdateData,
  ChangePasswordData,
  PaginatedResponse
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Two-step registration API
  uniqueMobile: async (mobile: string): Promise<{ exists: boolean }> => {
    const response = await api.get(`/auth/unique-mobile`, { params: { mobile } });
    return response.data;
  },
  registerMetadata: async (): Promise<{ countries: any[]; education: any[]; professions: any[] }> => {
    const response = await api.get('/auth/register-metadata');
    return response.data;
  },
  uniqueEmail: async (email: string): Promise<{ exists: boolean }> => {
    const response = await api.get('/auth/unique-email', { params: { email } });
    return response.data;
  },
  registerStep1: async (payload: { first_name: string; country_code: string; mobile_number: string; password: string }): Promise<{ user_id: number; username: string }> => {
    const response = await api.post('/auth/register-step1', payload);
    return response.data;
  },
  registerStep2: async (payload: any): Promise<AuthResponse & { message: string }> => {
    const response = await api.post('/auth/register-step2', payload);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User; profile?: UserProfile }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },
};

// Users API
export const usersAPI = {
  getProfile: async (): Promise<{ user: User; profile?: UserProfile }> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: ProfileUpdateData): Promise<{ message: string }> => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await api.put('/users/change-password', data);
    return response.data;
  },

  getAllUsers: async (page = 1, limit = 10): Promise<PaginatedResponse<User>> => {
    const response = await api.get(`/users?page=${page}&limit=${limit}`);
    return response.data;
  },
};

// Geographic API
export const geographicAPI = {
  getCountries: async (): Promise<Country[]> => {
    const response = await api.get('/geographic/countries');
    return response.data.countries;
  },

  getStates: async (countryId: number): Promise<State[]> => {
    const response = await api.get(`/geographic/states/${countryId}`);
    return response.data.states;
  },

  getDistricts: async (stateId: number): Promise<District[]> => {
    const response = await api.get(`/geographic/districts/${stateId}`);
    return response.data.districts;
  },
};

// Groups API
export const groupsAPI = {
  getAllGroups: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Group>> => {
    const response = await api.get(`/groups?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  },

  getGroupById: async (id: number): Promise<Group> => {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },

  createGroup: async (data: Partial<Group>): Promise<{ message: string; group: Group }> => {
    const response = await api.post('/groups', data);
    return response.data;
  },
};

export default api;
export interface User {
  id: number;
  username?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  group_id?: number;
  active: boolean;
  profile_img?: string;
  role?: 'user' | 'admin';
  name?: string;
  avatar?: string;
  date_of_birth?: string;
  gender?: string;
  profession?: string;
  country_id?: string;
  state_id?: string;
  district_id?: string;
  address?: string;
  pincode?: string;
  bio?: string;
  profile_image?: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Labor {
  id: number;
  name: string;
  phone: string;
  email?: string;
  skills: string;
  experience: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface NeedyService {
  id: number;
  title: string;
  description: string;
  category: string;
  price?: number;
  location: string;
  provider_id: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: number;
  title: string;
  type: 'tv' | 'radio' | 'news' | 'magazine' | 'webnews' | 'youtube';
  content: string;
  thumbnail?: string;
  url?: string;
  created_at: string;
  updated_at: string;
}

export interface Advertisement {
  id: number;
  title: string;
  type: 'popup' | 'header' | 'sidebar' | 'main';
  image_url: string;
  link_url?: string;
  duration?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Geographic {
  id: number;
  name: string;
  type: 'continent' | 'country' | 'state' | 'district';
  parent_id?: number;
  code?: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  bio?: string;
  avatar?: string;
  date_of_birth?: string;
  gender?: string;
  profession?: string;
  country_id?: string;
  state_id?: string;
  district_id?: string;
  address?: string;
  pincode?: string;
}

export interface Country {
  id: number;
  name: string;
  code?: string;
}

export interface State {
  id: number;
  name: string;
  country_id: number;
  code?: string;
}

export interface District {
  id: number;
  name: string;
  state_id: number;
  code?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  profile?: UserProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  date_of_birth?: string;
  gender?: string;
  profession?: string;
  country_id?: string;
  state_id?: string;
  district_id?: string;
  address?: string;
  pincode?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export type UserRole = 'admin' | 'team';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
}

export interface StudioProfile {
  id?: string;
  studio_name: string;
  studio_tagline: string | null;
  google_maps_url: string | null;
  longitude: number | null;
  latitude: number | null;
  created_at?: string;
  updated_at?: string;
}
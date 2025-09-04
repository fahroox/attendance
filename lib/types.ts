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

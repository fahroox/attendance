import { createClient } from "@/lib/supabase/server";
import { UserProfile, AuthUser } from "@/lib/types";

export async function getUserProfile(): Promise<AuthUser | null> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    return null;
  }

  return {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    full_name: profile.full_name,
  };
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getUserProfile();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return user;
}

export function getRedirectPath(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'team':
      return '/team/dashboard';
    default:
      return '/protected';
  }
}

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { AuthUser } from '@/lib/types';

export function useUserRole() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial user
    const getUser = async () => {
      try {
        console.log('Getting user role...');
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        console.log('Auth user result:', { authUser: !!authUser, error: authError });
        
        if (authError || !authUser) {
          console.log('No auth user, setting non-admin');
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Get user profile
        console.log('Getting user profile for:', authUser.id);
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        console.log('Profile result:', { profile: !!profile, error: profileError });

        if (profileError || !profile) {
          console.log('No profile found, setting non-admin');
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const userData: AuthUser = {
          id: profile.id,
          email: profile.email,
          role: profile.role,
          full_name: profile.full_name,
        };

        console.log('User data set:', { role: profile.role, isAdmin: profile.role === 'admin' });
        setUser(userData);
        setIsAdmin(profile.role === 'admin');
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await getUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isAdmin,
    isLoading,
  };
}

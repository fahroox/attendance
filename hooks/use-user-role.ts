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
    let timeoutId: NodeJS.Timeout;
    
    // Get initial user with timeout
    const getUser = async () => {
      try {
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          console.warn('User role check timed out, defaulting to non-admin');
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
        }, 10000); // 10 second timeout

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser) {
          clearTimeout(timeoutId);
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        clearTimeout(timeoutId);

        if (profileError || !profile) {
          console.warn('Profile not found, defaulting to non-admin:', profileError);
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

        setUser(userData);
        setIsAdmin(profile.role === 'admin');
        setIsLoading(false);
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error fetching user role:', error);
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await getUser();
      }
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isAdmin,
    isLoading,
  };
}

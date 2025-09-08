'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { AuthUser } from '@/lib/types';

export function useUserRole() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [hasAuthUser, setHasAuthUser] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let timeoutId: NodeJS.Timeout;
    
    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      console.warn('useUserRole hook timed out, defaulting to non-admin');
      setHasTimedOut(true);
      // If we have an auth user but no profile, create a default user
      if (hasAuthUser) {
        console.log('Creating default user for authenticated user without profile');
        setUser({
          id: 'unknown',
          email: 'unknown@example.com',
          role: 'team',
          full_name: 'User'
        });
        setIsAdmin(false);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    }, 5000); // 5 second timeout
    
    // Get initial user
    const getUser = async () => {
      try {
        console.log('Getting user role...');
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        console.log('Auth user result:', { authUser: !!authUser, error: authError });
        
        if (authError || !authUser) {
          console.log('No auth user, setting non-admin');
          clearTimeout(timeoutId);
          setHasAuthUser(false);
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // We have an auth user
        setHasAuthUser(true);

        // Get user profile
        console.log('Getting user profile for:', authUser.id);
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        console.log('Profile result:', { profile: !!profile, error: profileError });

        if (profileError || !profile) {
          console.log('No profile found, creating default user');
          clearTimeout(timeoutId);
          // Create a default user for authenticated users without profile
          setUser({
            id: authUser.id,
            email: authUser.email || 'unknown@example.com',
            role: 'team',
            full_name: authUser.user_metadata?.full_name || 'User'
          });
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
        clearTimeout(timeoutId);
        setUser(userData);
        setIsAdmin(profile.role === 'admin');
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user role:', error);
        clearTimeout(timeoutId);
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    // Check initial session first
    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session check:', { session: !!session, error });
        
        if (error || !session) {
          console.log('No initial session, setting non-admin');
          clearTimeout(timeoutId);
          setHasAuthUser(false);
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        // If we have a session, get user details
        await getUser();
      } catch (error) {
        console.error('Error checking initial session:', error);
        clearTimeout(timeoutId);
        setHasAuthUser(false);
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    checkInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, { session: !!session });
      if (event === 'SIGNED_OUT' || !session) {
        console.log('User signed out, clearing state');
        setHasAuthUser(false);
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('User signed in or token refreshed, getting user data');
        setHasAuthUser(true);
        await getUser();
      }
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array to run only once

  return {
    user,
    isAdmin,
    isLoading,
  };
}

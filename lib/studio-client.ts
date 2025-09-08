'use client';

import { createClient } from '@/lib/supabase/client';
import type { StudioProfile } from '@/lib/types';

/**
 * Fetch all studio profiles for public access (used for location matching)
 * This function doesn't require admin permissions
 */
export async function fetchPublicStudioProfiles(): Promise<StudioProfile[]> {
  try {
    const supabase = createClient();
    
    const { data: profiles, error } = await supabase
      .from('studio_profiles')
      .select('*')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching studio profiles:', error);
      return [];
    }

    return (profiles as StudioProfile[]) || [];
  } catch (error) {
    console.error('Unexpected error fetching studio profiles:', error);
    return [];
  }
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { StudioProfile } from "@/lib/types";

// Action state types
export interface ActionState {
  success?: boolean;
  error?: string;
  data?: StudioProfile | StudioProfile[];
}

// Fetch all studio profiles
export async function fetchStudioProfiles(): Promise<ActionState> {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "User not authenticated" };
    }

    // Check admin role
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (!userProfile || userProfile.role !== 'admin') {
      return { error: "User does not have admin permissions" };
    }

    // Fetch studio profiles
    const { data: profiles, error } = await supabase
      .from('studio_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching studio profiles:', error);
      return { error: "Failed to fetch studio profiles" };
    }

    return { success: true, data: profiles as StudioProfile[] || [] };
  } catch (error) {
    console.error('Unexpected error fetching studio profiles:', error);
    return { error: "An unexpected error occurred" };
  }
}

// Create new studio profile
export async function createStudioProfile(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "User not authenticated" };
    }

    // Check admin role
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (!userProfile || userProfile.role !== 'admin') {
      return { error: "User does not have admin permissions" };
    }

    // Extract form data
    const studio_name = formData.get('studio_name') as string;
    const studio_tagline = formData.get('studio_tagline') as string;
    const google_maps_url = formData.get('google_maps_url') as string;
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;

    // Validation
    if (!studio_name?.trim()) {
      return { error: "Studio name is required" };
    }

    const profileData = {
      studio_name: studio_name.trim(),
      studio_tagline: studio_tagline?.trim() || null,
      google_maps_url: google_maps_url?.trim() || null,
      longitude: longitude && longitude !== '' ? parseFloat(longitude) : null,
      latitude: latitude && latitude !== '' ? parseFloat(latitude) : null,
    };

    // Create profile
    const { data, error } = await supabase
      .from('studio_profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Error creating studio profile:', error);
      return { error: "Failed to create studio profile" };
    }

    revalidatePath('/studio-profile');
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error creating studio profile:', error);
    return { error: "An unexpected error occurred" };
  }
}

// Update existing studio profile
export async function updateStudioProfile(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "User not authenticated" };
    }

    // Check admin role
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (!userProfile || userProfile.role !== 'admin') {
      return { error: "User does not have admin permissions" };
    }

    // Extract form data
    const id = formData.get('id') as string;
    const studio_name = formData.get('studio_name') as string;
    const studio_tagline = formData.get('studio_tagline') as string;
    const google_maps_url = formData.get('google_maps_url') as string;
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;

    // Early Validation
    if (!id) {
      return { error: "Profile ID is required" };
    }
    if (!studio_name?.trim()) {
      return { error: "Studio name is required" };
    }

    const profileData = {
      studio_name: studio_name.trim(),
      studio_tagline: studio_tagline?.trim() || null,
      google_maps_url: google_maps_url?.trim() || null,
      longitude: longitude && longitude !== '' ? parseFloat(longitude) : null,
      latitude: latitude && latitude !== '' ? parseFloat(latitude) : null,
    };

    // Update profile
    const { data, error } = await supabase
      .from('studio_profiles')
      .update(profileData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating studio profile:', error);
      return { error: "Failed to update studio profile" };
    }

    revalidatePath('/studio-profile');
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error updating studio profile:', error);
    return { error: "An unexpected error occurred" };
  }
}

// Delete studio profile
export async function deleteStudioProfile(
  prevState: ActionState,
  profileId: string
): Promise<ActionState> {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "User not authenticated" };
    }

    // Check admin role
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (!userProfile || userProfile.role !== 'admin') {
      return { error: "User does not have admin permissions" };
    }

    // Delete profile
    const { error } = await supabase
      .from('studio_profiles')
      .delete()
      .eq('id', profileId);

    if (error) {
      console.error('Error deleting studio profile:', error);
      return { error: "Failed to delete studio profile" };
    }

    revalidatePath('/studio-profile');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting studio profile:', error);
    return { error: "An unexpected error occurred" };
  }
}

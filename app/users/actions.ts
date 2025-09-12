"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { UserProfile } from "@/lib/types";

// Action state types
export interface ActionState {
  success?: boolean;
  error?: string;
  data?: UserProfile | UserProfile[];
}

// Fetch all users
export async function fetchUsers(): Promise<ActionState> {
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

    // Fetch users
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return { error: "Failed to fetch users" };
    }

    return { success: true, data: users as UserProfile[] || [] };
  } catch (error) {
    console.error('Unexpected error fetching users:', error);
    return { error: "An unexpected error occurred" };
  }
}

// Create new user
export async function createUser(
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
    const email = formData.get('email') as string;
    const full_name = formData.get('full_name') as string;
    const role = formData.get('role') as 'admin' | 'team';

    // Validation
    if (!email?.trim()) {
      return { error: "Email is required" };
    }

    if (!role || !['admin', 'team'].includes(role)) {
      return { error: "Valid role is required" };
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email.trim())
      .single();

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Generate a temporary password (user will need to reset it)
    const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';

    // Check if admin client is available
    if (!supabaseAdmin) {
      return { error: "Admin operations are not available. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables." };
    }

    // Create user through Supabase Auth Admin API
    const { data: authData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: tempPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: role,
        full_name: full_name?.trim() || null,
      }
    });

    if (createUserError) {
      console.error('Error creating auth user:', createUserError);
      return { error: "Failed to create user account" };
    }

    if (!authData.user) {
      return { error: "Failed to create user account" };
    }

    // The trigger should automatically create the profile, but let's verify
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profileData) {
      console.error('Error fetching created profile:', profileError);
      return { error: "User created but profile not found" };
    }

    revalidatePath('/users');
    return { success: true, data: profileData };
  } catch (error) {
    console.error('Unexpected error creating user:', error);
    return { error: "An unexpected error occurred" };
  }
}

// Update existing user
export async function updateUser(
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
    const email = formData.get('email') as string;
    const full_name = formData.get('full_name') as string;
    const role = formData.get('role') as 'admin' | 'team';

    // Early Validation
    if (!id) {
      return { error: "User ID is required" };
    }
    if (!email?.trim()) {
      return { error: "Email is required" };
    }
    if (!role || !['admin', 'team'].includes(role)) {
      return { error: "Valid role is required" };
    }

    // Check if email is already taken by another user
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email.trim())
      .neq('id', id)
      .single();

    if (existingUser) {
      return { error: "Email is already taken by another user" };
    }

    const userData = {
      email: email.trim(),
      full_name: full_name?.trim() || null,
      role: role,
    };

    // Update user
    const { data, error } = await supabase
      .from('user_profiles')
      .update(userData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return { error: "Failed to update user" };
    }

    revalidatePath('/users');
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error updating user:', error);
    return { error: "An unexpected error occurred" };
  }
}

// Delete user
export async function deleteUser(
  prevState: ActionState,
  userId: string
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

    // Prevent deleting self
    if (userId === user.id) {
      return { error: "You cannot delete your own account" };
    }

    // Check if admin client is available
    if (!supabaseAdmin) {
      return { error: "Admin operations are not available. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables." };
    }

    // Delete user from auth and profile (cascade will handle profile deletion)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error);
      return { error: "Failed to delete user" };
    }

    revalidatePath('/users');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting user:', error);
    return { error: "An unexpected error occurred" };
  }
}

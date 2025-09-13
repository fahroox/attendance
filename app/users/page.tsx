import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LocationAwareDashboardSidebar } from "@/components/location-aware-dashboard-sidebar";
import { UsersManagerWithActions } from "@/components/users-manager-with-actions";
import { fetchUsers } from "./actions";
import type { UserProfile } from "@/lib/types";

export default async function UsersPage() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !authUser) {
    redirect("/auth/login");
  }

  // Get user profile
  const { data: upsertedProfile, error: upsertError } = await supabase
    .from('user_profiles')
    .upsert({
      id: authUser.id,
      email: authUser.email || '',
      role: authUser.user_metadata?.role || 'team',
      full_name: authUser.user_metadata?.full_name || '',
    }, {
      onConflict: 'id'
    })
    .select()
    .single();

  if (upsertError) {
    console.error('Error upserting profile:', upsertError);
    redirect("/auth/login");
  }

  const user = {
    id: upsertedProfile.id,
    email: upsertedProfile.email,
    role: upsertedProfile.role,
    full_name: upsertedProfile.full_name,
  };

  // Only admins can access users management
  if (user.role !== 'admin') {
    redirect("/dashboard");
  }

  // Fetch users using action
  const usersResult = await fetchUsers();
  const users = usersResult.success ? (usersResult.data as UserProfile[]) : [];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <LocationAwareDashboardSidebar user={user} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Users Management</h1>
            <p className="text-muted-foreground">
              Manage your design studio team members
            </p>
          </div>
          
          <UsersManagerWithActions initialUsers={users || []} />
        </div>
      </div>
    </div>
  );
}

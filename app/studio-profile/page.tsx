import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { StudioProfilesManagerWithActions } from "@/components/studio-profiles-manager-with-actions";
import { fetchStudioProfiles } from "./actions";

export default async function StudioProfile() {
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

  // Only admins can access studio profile
  if (user.role !== 'admin') {
    redirect("/dashboard");
  }

  // Fetch studio profiles using action
  const profilesResult = await fetchStudioProfiles();
  const studioProfiles = profilesResult.success ? profilesResult.data as any[] : [];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DashboardSidebar user={user} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">
            <StudioProfilesManagerWithActions initialProfiles={studioProfiles || []} />
        </div>
      </div>
    </div>
  );
}

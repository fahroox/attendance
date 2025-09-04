import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Building2 } from "lucide-react";
import { StudioProfileForm } from "@/components/studio-profile-form";

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

  // Get existing studio profile
  const { data: studioProfile } = await supabase
    .from('studio_profiles')
    .select('*')
    .single();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DashboardSidebar user={user} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              Studio Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your design studio information and settings
            </p>
          </div>

          <div className="max-w-2xl">
            <StudioProfileForm initialData={studioProfile} />
          </div>
        </div>
      </div>
    </div>
  );
}

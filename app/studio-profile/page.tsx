import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Phone, Mail, Users, Calendar } from "lucide-react";

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

          <div className="grid gap-6">
            {/* Studio Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Studio Information</CardTitle>
                <CardDescription>
                  Basic information about your design studio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Studio Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter studio name"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="Design Studio"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Industry</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Graphic Design, Web Development"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="Design & Development"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea 
                    placeholder="Describe your studio..."
                    className="w-full px-3 py-2 border rounded-md h-20"
                    defaultValue="A creative design studio specializing in modern, user-centered design solutions."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Studio contact details and location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </label>
                    <input 
                      type="email" 
                      placeholder="studio@example.com"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="contact@designstudio.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </label>
                  <textarea 
                    placeholder="Studio address..."
                    className="w-full px-3 py-2 border rounded-md h-16"
                    defaultValue="123 Design Street, Creative City, CC 12345"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Studio Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle>Studio Statistics</CardTitle>
                <CardDescription>
                  Overview of your studio's activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-muted-foreground">Team Members</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">156</div>
                    <div className="text-sm text-muted-foreground">Days Active</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Building2 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-muted-foreground">Years Established</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button>Save Changes</Button>
              <Button variant="outline">Preview Profile</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

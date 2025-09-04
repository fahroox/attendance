import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Key, Bell, Globe } from "lucide-react";

export default async function Account() {
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DashboardSidebar user={user} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <User className="h-8 w-8" />
              Account Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your personal information and account preferences
            </p>
          </div>

          <div className="grid gap-6">
            {/* Personal Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue={user.full_name || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      value={user.email}
                      className="w-full px-3 py-2 border rounded-md bg-muted"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <textarea 
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 border rounded-md h-20"
                    defaultValue="Design enthusiast passionate about creating beautiful user experiences."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-blue-500" />
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-muted-foreground">
                          Last updated 30 days ago
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-500" />
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences Card */}
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your experience and notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-orange-500" />
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about your account
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-purple-500" />
                      <div>
                        <h3 className="font-medium">Language</h3>
                        <p className="text-sm text-muted-foreground">
                          Choose your preferred language
                        </p>
                      </div>
                    </div>
                    <select className="px-3 py-1 border rounded-md text-sm">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  View your account details and role information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">User ID</label>
                    <input 
                      type="text" 
                      value={user.id}
                      className="w-full px-3 py-2 border rounded-md bg-muted font-mono text-sm"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

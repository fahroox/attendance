import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LocationAwareDashboardSidebar } from "@/components/location-aware-dashboard-sidebar";
import { UserLocationDisplay } from "@/components/user-location-display";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !authUser) {
    redirect("/auth/login");
  }

  // Use UPSERT to handle both insert and update cases
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
      <div className="lg:w-64">
        <LocationAwareDashboardSidebar user={user} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.full_name || user.email}
            </p>
          </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Admin-specific card */}
          {user.role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>
                  Manage your design studio team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin">
                    Go to Admin Panel
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* User Location Display */}
          <UserLocationDisplay />

          {/* Attendance card for all users */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
              <CardDescription>
                Track your daily attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Not Checked In</span>
                </div>
                <Button className="w-full mt-4">
                  Check In
                </Button>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  Current time: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile card for all users */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {user.role}
                  </span>
                </p>
                <p><strong>Name:</strong> {user.full_name || 'Not set'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Team-specific card */}
          {user.role === 'team' && (
            <Card>
              <CardHeader>
                <CardTitle>Team Member</CardTitle>
                <CardDescription>
                  Your team member dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>• View your attendance history</p>
                  <p>• Check in/out daily</p>
                  <p>• Track your hours</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                {user.role === 'admin' ? 'Admin tasks and features' : 'Common tasks and features'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {user.role === 'admin' ? (
                  <>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Team Management</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Manage team members and roles
                      </p>
                      <Button variant="outline" className="w-full" disabled>
                        Coming Soon
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Team Reports</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        View team attendance analytics
                      </p>
                      <Button variant="outline" className="w-full" disabled>
                        Coming Soon
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Attendance History</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        View your attendance records
                      </p>
                      <Button variant="outline" className="w-full" disabled>
                        Coming Soon
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Time Tracking</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Track your work hours
                      </p>
                      <Button variant="outline" className="w-full" disabled>
                        Coming Soon
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
}

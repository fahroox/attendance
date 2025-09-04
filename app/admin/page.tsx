import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  let user;
  
  try {
    user = await requireAdmin();
  } catch (error) {
    redirect("/auth/login");
  }

  // Fetch all user profiles
  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage your design studio team
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard">
                Back to Dashboard
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              All registered users in your design studio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profiles && profiles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Email</th>
                      <th className="text-left p-3 font-semibold">Role</th>
                      <th className="text-left p-3 font-semibold">Display Name</th>
                      <th className="text-left p-3 font-semibold">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile) => (
                      <tr key={profile.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">{profile.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            profile.role === 'admin' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {profile.role}
                          </span>
                        </td>
                        <td className="p-3">{profile.full_name || 'Not set'}</td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No team members found.</p>
                <p className="text-sm">Users will appear here once they sign up.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
              <CardDescription>
                Manage your design studio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Team Management</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add, edit, or remove team members
                  </p>
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Attendance Reports</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    View team attendance analytics
                  </p>
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

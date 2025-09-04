import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  let user;
  
  try {
    user = await requireAdmin();
  } catch (error) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.full_name || user.email}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your design studio team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">
                Active team members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Today</CardTitle>
              <CardDescription>
                Track daily attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">
                Present today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                View attendance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">
                Reports generated
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Manage Team</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add, edit, or remove team members
                  </p>
                  <button className="text-sm text-primary hover:underline">
                    Coming Soon
                  </button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">View Reports</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Generate attendance reports
                  </p>
                  <button className="text-sm text-primary hover:underline">
                    Coming Soon
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

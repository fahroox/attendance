import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function TeamDashboard() {
  let user;
  
  try {
    user = await requireAuth();
  } catch (error) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Team Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.full_name || user.email}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Today's Status</CardTitle>
              <CardDescription>
                Your attendance for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-semibold">Not Checked In</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
              <CardDescription>
                Your weekly attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0/5</p>
              <p className="text-xs text-muted-foreground">
                Days present this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
              <CardDescription>
                Your monthly attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">
                Days present this month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Mark your attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Check In</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Mark your arrival time
                  </p>
                  <Button className="w-full">
                    Check In
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Check Out</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Mark your departure time
                  </p>
                  <Button variant="outline" className="w-full" disabled>
                    Check Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent attendance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No attendance records yet.</p>
                <p className="text-sm">Check in to start tracking your attendance.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, Calendar, Download, Filter } from "lucide-react";

export default async function Reports() {
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

  // Only admins can access reports
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
              <BarChart3 className="h-8 w-8" />
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground">
              View attendance analytics and team performance reports
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Team</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Present Today</p>
                    <p className="text-2xl font-bold">10</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Avg. Hours</p>
                    <p className="text-2xl font-bold">8.2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                    <p className="text-2xl font-bold">94%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6">
            {/* Attendance Overview Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Attendance Overview</CardTitle>
                    <CardDescription>
                      Team attendance for the current month
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample attendance data */}
                  {[
                    { name: "John Doe", present: 22, absent: 1, late: 2 },
                    { name: "Jane Smith", present: 23, absent: 0, late: 0 },
                    { name: "Mike Johnson", present: 21, absent: 2, late: 1 },
                    { name: "Sarah Wilson", present: 23, absent: 0, late: 1 },
                    { name: "David Brown", present: 20, absent: 3, late: 0 }
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.present} present, {member.absent} absent, {member.late} late
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {Math.round((member.present / (member.present + member.absent)) * 100)}%
                        </p>
                        <p className="text-sm text-muted-foreground">attendance</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends Card */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>
                  Attendance patterns over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Chart visualization coming soon</p>
                    <p className="text-sm text-muted-foreground">
                      Monthly attendance trends will be displayed here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Performance Card */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>
                  Individual and team performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Top Performers</h3>
                    <div className="space-y-2">
                      {[
                        { name: "Jane Smith", score: "100%" },
                        { name: "Sarah Wilson", score: "96%" },
                        { name: "John Doe", score: "92%" }
                      ].map((performer, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium">{performer.name}</span>
                          <span className="text-green-600 font-semibold">{performer.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Areas for Improvement</h3>
                    <div className="space-y-2">
                      {[
                        { name: "David Brown", score: "87%" },
                        { name: "Mike Johnson", score: "88%" }
                      ].map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-orange-600 font-semibold">{member.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

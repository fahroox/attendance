import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LocationAwareHeader } from "@/components/location-aware-header";
import { LocationFeatureInfo } from "@/components/location-feature-info";
import { LocationAccessIndicator } from "@/components/location-access-indicator";
import { LocationAccessGuide } from "@/components/location-access-guide";
import { hasEnvVars } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <LocationAwareHeader>
          {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
        </LocationAwareHeader>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <div className="flex flex-col items-center gap-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Design Studio Attendance System
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Track attendance, manage your team, and generate reports for your design studio.
              Built with Next.js, Supabase, and modern web technologies.
            </p>
            {hasEnvVars && (
              <div className="flex gap-4">
                <Button asChild size="lg">
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
          
          {hasEnvVars && (
            <div className="space-y-8">
              {/* Location Access Guide */}
              <LocationAccessGuide />
              
              {/* Location Access Indicator */}
              <div className="flex justify-center">
                <LocationAccessIndicator 
                  onLocationGranted={() => {
                    // Auto-trigger location detection when permission is granted
                    console.log('Location permission granted - ready for studio matching');
                  }}
                  onLocationDenied={() => {
                    console.log('Location permission denied');
                  }}
                />
              </div>
              
              {/* Location Feature Info */}
              <LocationFeatureInfo />
              
              {/* Feature Cards */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>For Team Members</CardTitle>
                    <CardDescription>
                      Track your daily attendance and view your records
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Check in and check out</li>
                      <li>• View attendance history</li>
                      <li>• Track weekly/monthly stats</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>For Administrators</CardTitle>
                    <CardDescription>
                      Manage your team and generate attendance reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Manage team members</li>
                      <li>• View team attendance</li>
                      <li>• Generate reports</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {!hasEnvVars && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Setup Required</h2>
              <p className="text-muted-foreground mb-6">
                Please configure your environment variables to get started.
              </p>
              <EnvVarWarning />
            </div>
          )}
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}

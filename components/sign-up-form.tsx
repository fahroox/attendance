"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState<"admin" | "team">("team");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // First, check if user already exists in our user_profiles table
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingProfile) {
        setError("This email is already registered. Please try logging in instead.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            role: role,
          },
        },
      });

      // Debug logging
      console.log('Signup response:', { data, error });

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('already registered') || 
            error.message.includes('User already registered') ||
            error.message.includes('already been registered') ||
            error.message.includes('already exists')) {
          setError("This email is already registered. Please try logging in instead.");
        } else if (error.message.includes('Invalid email')) {
          setError("Please enter a valid email address.");
        } else if (error.message.includes('Password should be at least')) {
          setError("Password must be at least 6 characters long.");
        } else {
          setError(error.message || "An error occurred. Please try again.");
        }
        return;
      }

      // Check if user was created or if it's a duplicate
      if (data.user) {
        // Check if this is a new user or existing user
        if (data.user.email_confirmed_at) {
          // User already exists and is confirmed
          setError("This email is already registered. Please try logging in instead.");
        } else {
          // For unconfirmed users, we need to be more careful
          // Check if the user was just created (within the last 2 seconds)
          const now = new Date().getTime();
          const createdTime = new Date(data.user.created_at).getTime();
          const timeDiff = now - createdTime;
          
          // If the user was created more than 2 seconds ago, it's likely an existing user
          if (timeDiff > 2000) {
            setError("This email is already registered. Please try logging in instead.");
          } else {
            // New user created, redirect to success page
            router.push("/auth/sign-up-success");
          }
        }
      } else {
        // No user data returned, likely an issue
        setError("An error occurred during signup. Please try again.");
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      if (error instanceof Error) {
        setError(error.message || "An error occurred. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repeat Password</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value: "admin" | "team") => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Team Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating an account..." : "Sign up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

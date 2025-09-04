# Deployment Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
# Get these values from your Supabase project dashboard: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key

# Optional: For server-side operations (if needed)
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Supabase Setup

1. **Create a Supabase Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project
   - Note down your project URL and anon key

2. **Run Database Setup**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-setup.sql`
   - Execute the SQL to create the necessary tables and functions

3. **Configure Authentication**
   - Go to Authentication > Settings in your Supabase dashboard
   - Add your domain to "Site URL" and "Redirect URLs"
   - For local development: `http://localhost:3000`
   - For production: `https://your-domain.vercel.app`

## Vercel Deployment

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Or use the Vercel CLI: `vercel --prod`

2. **Set Environment Variables**
   - In your Vercel project settings, add the environment variables from above
   - Make sure to use your production Supabase URL and keys

3. **Update Supabase Settings**
   - Add your Vercel domain to Supabase redirect URLs
   - Update the site URL in Supabase settings

## Testing

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Test Authentication**
   - Sign up with a new account
   - Try both admin and team roles
   - Test login/logout functionality
   - Test password reset

3. **Test Role-based Access**
   - Create an admin account and verify admin dashboard access
   - Create a team account and verify team dashboard access
   - Try accessing admin routes with a team account (should redirect)

## Features Implemented

✅ **Authentication**
- User signup with role selection (admin/team)
- User login with role-based redirects
- Password reset functionality
- Secure session management

✅ **Role-based Access Control**
- Admin dashboard with team management capabilities
- Team dashboard with attendance tracking
- Middleware protection for admin routes
- Automatic role-based redirects

✅ **Database Schema**
- User profiles table with role field
- Row-level security policies
- Automatic profile creation on signup
- Role-based data access controls

## Next Steps

This is a foundation for your attendance system. Future features could include:

- **Attendance Tracking**: Check-in/check-out functionality
- **Reports**: Attendance reports and analytics
- **Team Management**: Admin tools for managing team members
- **Notifications**: Email/SMS notifications for attendance
- **Calendar Integration**: Integration with calendar systems
- **Mobile App**: React Native or PWA for mobile access

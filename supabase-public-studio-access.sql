-- Add public read access to studio_profiles for location matching
-- This allows unauthenticated users to read studio profiles for finding nearest studios

-- Create policy for public read access to studio profiles
CREATE POLICY "Public can view studio profiles for location matching" ON public.studio_profiles
  FOR SELECT USING (true);

-- Note: This policy allows anyone (including unauthenticated users) to read studio profiles
-- This is needed for the landing page to show nearest studios to visitors
-- The policy only allows SELECT (read) operations, not INSERT/UPDATE/DELETE

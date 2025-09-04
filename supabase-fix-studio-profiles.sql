-- Fix script for studio_profiles table
-- This script ensures the table has the correct structure and permissions

-- First, let's check if the table exists and has the right columns
-- If the table doesn't exist, create it
CREATE TABLE IF NOT EXISTS public.studio_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  studio_name TEXT NOT NULL,
  studio_tagline TEXT,
  google_maps_url TEXT,
  longitude DECIMAL(11, 8),
  latitude DECIMAL(10, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If the table exists but is missing columns, add them
DO $$ 
BEGIN
    -- Add google_maps_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'studio_profiles' 
                   AND column_name = 'google_maps_url') THEN
        ALTER TABLE public.studio_profiles ADD COLUMN google_maps_url TEXT;
    END IF;
    
    -- Add longitude column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'studio_profiles' 
                   AND column_name = 'longitude') THEN
        ALTER TABLE public.studio_profiles ADD COLUMN longitude DECIMAL(11, 8);
    END IF;
    
    -- Add latitude column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'studio_profiles' 
                   AND column_name = 'latitude') THEN
        ALTER TABLE public.studio_profiles ADD COLUMN latitude DECIMAL(10, 8);
    END IF;
    
    -- Remove old address column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'studio_profiles' 
               AND column_name = 'address') THEN
        ALTER TABLE public.studio_profiles DROP COLUMN address;
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.studio_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view studio profiles" ON public.studio_profiles;
DROP POLICY IF EXISTS "Admins can insert studio profiles" ON public.studio_profiles;
DROP POLICY IF EXISTS "Admins can update studio profiles" ON public.studio_profiles;
DROP POLICY IF EXISTS "Admins can delete studio profiles" ON public.studio_profiles;

-- Create policies for studio_profiles
CREATE POLICY "Admins can view studio profiles" ON public.studio_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert studio profiles" ON public.studio_profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update studio profiles" ON public.studio_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete studio profiles" ON public.studio_profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at if it doesn't exist
DROP TRIGGER IF EXISTS update_studio_profiles_updated_at ON public.studio_profiles;
CREATE TRIGGER update_studio_profiles_updated_at
  BEFORE UPDATE ON public.studio_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments to document the columns
COMMENT ON COLUMN public.studio_profiles.google_maps_url IS 'Google Maps URL for studio location';
COMMENT ON COLUMN public.studio_profiles.longitude IS 'Longitude extracted from Google Maps URL';
COMMENT ON COLUMN public.studio_profiles.latitude IS 'Latitude extracted from Google Maps URL';

-- Insert default studio profile if none exists
INSERT INTO public.studio_profiles (studio_name, studio_tagline, google_maps_url, longitude, latitude)
VALUES (
  'Design Studio',
  'Creating beautiful experiences',
  'https://maps.google.com/?q=123+Design+Street,+Creative+City,+CC+12345',
  40.7128,
  -74.0060
) ON CONFLICT DO NOTHING;

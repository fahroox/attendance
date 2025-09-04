-- Create studio_profiles table
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

-- Enable Row Level Security
ALTER TABLE public.studio_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for studio_profiles
-- Only admins can view, insert, update, and delete studio profiles
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_studio_profiles_updated_at
  BEFORE UPDATE ON public.studio_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default studio profile (optional)
INSERT INTO public.studio_profiles (studio_name, studio_tagline, google_maps_url, longitude, latitude)
VALUES (
  'Design Studio',
  'Creating beautiful experiences',
  'https://maps.google.com/?q=123+Design+Street,+Creative+City,+CC+12345',
  40.7128,
  -74.0060
) ON CONFLICT DO NOTHING;

-- Migration script to update studio_profiles table from address to google_maps_url
-- Run this if you have an existing studio_profiles table with an 'address' column

-- Step 1: Add new columns
ALTER TABLE public.studio_profiles 
ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS latitude DECIMAL(11, 8);

-- Step 2: Migrate existing address data to google_maps_url (optional)
-- This will convert existing address text to a Google Maps search URL
UPDATE public.studio_profiles 
SET google_maps_url = 'https://maps.google.com/?q=' || REPLACE(address, ' ', '+')
WHERE address IS NOT NULL AND google_maps_url IS NULL;

-- Step 3: Drop the old address column (uncomment when ready)
-- ALTER TABLE public.studio_profiles DROP COLUMN IF EXISTS address;

-- Step 4: Add comments to document the new columns
COMMENT ON COLUMN public.studio_profiles.google_maps_url IS 'Google Maps URL for studio location';
COMMENT ON COLUMN public.studio_profiles.longitude IS 'Longitude extracted from Google Maps URL';
COMMENT ON COLUMN public.studio_profiles.latitude IS 'Latitude extracted from Google Maps URL';

-- Fix coordinate precision for existing studio_profiles table
-- This script fixes the DECIMAL precision for longitude and latitude columns

-- First, let's check the current column definitions
SELECT column_name, data_type, numeric_precision, numeric_scale 
FROM information_schema.columns 
WHERE table_name = 'studio_profiles' 
AND column_name IN ('longitude', 'latitude');

-- Fix longitude column precision (needs to handle values like 112.6069239)
-- Change from DECIMAL(10,8) to DECIMAL(11,8)
ALTER TABLE public.studio_profiles 
ALTER COLUMN longitude TYPE DECIMAL(11, 8);

-- Fix latitude column precision (needs to handle values like -8.0019522)
-- Change from DECIMAL(11,8) to DECIMAL(10,8) 
ALTER TABLE public.studio_profiles 
ALTER COLUMN latitude TYPE DECIMAL(10, 8);

-- Verify the changes
SELECT column_name, data_type, numeric_precision, numeric_scale 
FROM information_schema.columns 
WHERE table_name = 'studio_profiles' 
AND column_name IN ('longitude', 'latitude');

-- Add comments to document the correct ranges
COMMENT ON COLUMN public.studio_profiles.longitude IS 'Longitude extracted from Google Maps URL (range: -180 to 180)';
COMMENT ON COLUMN public.studio_profiles.latitude IS 'Latitude extracted from Google Maps URL (range: -90 to 90)';

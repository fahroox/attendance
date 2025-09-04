"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Check, Building2, Tag, MapPin, ExternalLink } from "lucide-react";
import { extractCoordinatesFromGoogleMapsUrl, validateCoordinates, formatCoordinates } from "@/lib/coordinates";
// import { toast } from "sonner";

interface StudioProfile {
  id?: string;
  studio_name: string;
  studio_tagline: string | null;
  google_maps_url: string | null;
  longitude: number | null;
  latitude: number | null;
  created_at?: string;
  updated_at?: string;
}

interface StudioProfileFormProps {
  initialData?: StudioProfile | null;
}

export function StudioProfileForm({ initialData }: StudioProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    studio_name: initialData?.studio_name || "",
    studio_tagline: initialData?.studio_tagline || "",
    google_maps_url: initialData?.google_maps_url || "",
  });

  const [extractedCoordinates, setExtractedCoordinates] = useState({
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
  });

  // Hidden input values for form submission
  const [hiddenLatitude, setHiddenLatitude] = useState(initialData?.latitude?.toString() || '');
  const [hiddenLongitude, setHiddenLongitude] = useState(initialData?.longitude?.toString() || '');

  // Effect to handle initial data loading and coordinate extraction
  useEffect(() => {
    if (initialData?.google_maps_url && !extractedCoordinates.latitude && !extractedCoordinates.longitude) {
      // If we have a URL but no coordinates, extract them
      const coordinates = extractCoordinatesFromGoogleMapsUrl(initialData.google_maps_url);
      setExtractedCoordinates(coordinates);
      setHiddenLatitude(coordinates.latitude?.toString() || '');
      setHiddenLongitude(coordinates.longitude?.toString() || '');
    } else if (initialData?.latitude && initialData?.longitude) {
      // If we have existing coordinates, use them
      setExtractedCoordinates({
        latitude: initialData.latitude,
        longitude: initialData.longitude
      });
      setHiddenLatitude(initialData.latitude.toString());
      setHiddenLongitude(initialData.longitude.toString());
    }
  }, [initialData, extractedCoordinates.latitude, extractedCoordinates.longitude]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Extract coordinates when Google Maps URL changes
    if (field === 'google_maps_url') {
      const coordinates = extractCoordinatesFromGoogleMapsUrl(value);
      setExtractedCoordinates(coordinates);
      
      // Update hidden inputs with extracted coordinates
      setHiddenLatitude(coordinates.latitude?.toString() || '');
      setHiddenLongitude(coordinates.longitude?.toString() || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const supabase = createClient();
      
      // Test the connection first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      console.log('Current user:', user);
      
      // Check if user has admin role
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      console.log('User profile:', userProfile);
      
      if (!userProfile || userProfile.role !== 'admin') {
        throw new Error('User does not have admin permissions');
      }
      
      // Validate required fields
      if (!formData.studio_name.trim()) {
        alert("Studio name is required");
        setIsLoading(false);
        return;
      }

      const profileData = {
        studio_name: formData.studio_name.trim(),
        studio_tagline: formData.studio_tagline.trim() || null,
        google_maps_url: formData.google_maps_url.trim() || null,
        longitude: hiddenLongitude && hiddenLongitude !== '' ? parseFloat(hiddenLongitude) : null,
        latitude: hiddenLatitude && hiddenLatitude !== '' ? parseFloat(hiddenLatitude) : null,
      };

      console.log('Profile data being sent:', profileData);

      if (initialData?.id) {
        // Update existing profile
        const { error } = await supabase
          .from('studio_profiles')
          .update(profileData)
          .eq('id', initialData.id);

        if (error) throw error;
        
        console.log("Studio profile updated successfully!");
      } else {
        // Create new profile
        const { error } = await supabase
          .from('studio_profiles')
          .insert(profileData);

        if (error) throw error;
        
        console.log("Studio profile created successfully!");
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        router.refresh();
      }, 2000);

    } catch (error) {
      console.error('Error saving studio profile:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Show more specific error message
      let errorMessage = "Failed to save studio profile. Please try again.";
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Studio Information
        </CardTitle>
        <CardDescription>
          Manage your design studio information and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden inputs for coordinates */}
          <input type="hidden" name="latitude" value={hiddenLatitude} />
          <input type="hidden" name="longitude" value={hiddenLongitude} />
          
          {/* Studio Name */}
          <div className="space-y-2">
            <Label htmlFor="studio_name" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Studio Name *
            </Label>
            <Input
              id="studio_name"
              type="text"
              placeholder="Enter your studio name"
              value={formData.studio_name}
              onChange={(e) => handleInputChange('studio_name', e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Studio Tagline */}
          <div className="space-y-2">
            <Label htmlFor="studio_tagline" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Studio Tagline
            </Label>
            <Input
              id="studio_tagline"
              type="text"
              placeholder="Enter your studio tagline"
              value={formData.studio_tagline}
              onChange={(e) => handleInputChange('studio_tagline', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Google Maps URL */}
          <div className="space-y-2">
            <Label htmlFor="google_maps_url" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Google Maps URL
            </Label>
            <Input
              id="google_maps_url"
              type="url"
              placeholder="https://www.google.com/maps/place/Your+Studio/@-8.0019522,112.6069239,19z/data=..."
              value={formData.google_maps_url}
              onChange={(e) => handleInputChange('google_maps_url', e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Paste a Google Maps URL to automatically extract coordinates
            </p>
            
            {/* Display extracted coordinates */}
            {extractedCoordinates.latitude !== null && extractedCoordinates.longitude !== null && 
             validateCoordinates(extractedCoordinates) && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center gap-2 text-green-700">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">Coordinates extracted:</span>
                </div>
                <div className="text-sm text-green-600 mt-1">
                  {hiddenLatitude && hiddenLongitude ? `${hiddenLatitude}, ${hiddenLongitude}` : formatCoordinates(extractedCoordinates)}
                </div>
                {formData.google_maps_url && (
                  <a 
                    href={formData.google_maps_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open in Google Maps
                  </a>
                )}
              </div>
            )}
            
            {/* Show warning if URL is provided but coordinates couldn't be extracted */}
            {formData.google_maps_url && 
             (extractedCoordinates.latitude === null || extractedCoordinates.longitude === null) && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="text-sm text-yellow-700">
                  ⚠️ Could not extract coordinates from this URL. Please ensure it&apos;s a valid Google Maps URL with coordinates.
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            
            {isSuccess && (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm">Changes saved successfully!</span>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

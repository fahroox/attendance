"use client";

import { useState, useEffect, useActionState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Check, Building2, Tag, MapPin, ExternalLink } from "lucide-react";
import { extractCoordinatesFromGoogleMapsUrl, validateCoordinates, formatCoordinates } from "@/lib/coordinates";
import { StudioProfile } from "@/lib/types";
import { createStudioProfile, updateStudioProfile } from "@/app/studio-profile/actions";
import { showValidationErrorToast, showSaveSuccessToast, showOperationErrorToast } from "@/lib/toast";

interface StudioProfileFormWithActionsProps {
  initialData?: StudioProfile | null;
  onSuccess?: (profile: StudioProfile) => void;
  onCancel?: () => void;
}

export function StudioProfileFormWithActions({ 
  initialData, 
  onSuccess, 
  onCancel 
}: StudioProfileFormWithActionsProps) {
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

  // Use useActionState for form submission
  const [createState, createAction, isCreatePending] = useActionState(createStudioProfile, {});
  const [updateState, updateAction, isUpdatePending] = useActionState(updateStudioProfile, {});

  const isPending = isCreatePending || isUpdatePending;
  const currentState = initialData?.id ? updateState : createState;
  const currentAction = initialData?.id ? updateAction : createAction;

  // Effect to handle initial data loading and coordinate extraction
  useEffect(() => {
    if (initialData?.google_maps_url && !extractedCoordinates.latitude && !extractedCoordinates.longitude) {
      const coordinates = extractCoordinatesFromGoogleMapsUrl(initialData.google_maps_url);
      setExtractedCoordinates(coordinates);
      setHiddenLatitude(coordinates.latitude?.toString() || '');
      setHiddenLongitude(coordinates.longitude?.toString() || '');
    } else if (initialData?.latitude && initialData?.longitude) {
      setExtractedCoordinates({
        latitude: initialData.latitude,
        longitude: initialData.longitude
      });
      setHiddenLatitude(initialData.latitude.toString());
      setHiddenLongitude(initialData.longitude.toString());
    }
  }, [initialData]);

  // Handle action state changes
  useEffect(() => {
    if (currentState.success && currentState.data) {
      const savedProfile = Array.isArray(currentState.data) ? currentState.data[0] : currentState.data;
      showSaveSuccessToast(savedProfile.studio_name, initialData?.id ? "updated" : "created");
      if (onSuccess) {
        onSuccess(savedProfile);
      }
    } else if (currentState.error) {
      showOperationErrorToast("Save Studio Profile", currentState.error);
    }
  }, [currentState, onSuccess, initialData?.id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Extract coordinates when Google Maps URL changes
    if (field === 'google_maps_url') {
      const coordinates = extractCoordinatesFromGoogleMapsUrl(value);
      setExtractedCoordinates(coordinates);
      setHiddenLatitude(coordinates.latitude?.toString() || '');
      setHiddenLongitude(coordinates.longitude?.toString() || '');
    }
  };

  const handleSubmit = (formData: FormData) => {
    // Add hidden coordinate values to form data
    formData.set('latitude', hiddenLatitude);
    formData.set('longitude', hiddenLongitude);
    
    // Add ID for update operations
    if (initialData?.id) {
      formData.set('id', initialData.id);
    }
    
    currentAction(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {initialData?.id ? 'Edit Studio Profile' : 'Create New Studio Profile'}
        </CardTitle>
        <CardDescription>
          {initialData?.id 
            ? `Update the information for ${initialData.studio_name}`
            : 'Add a new studio profile to your collection'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {/* Studio Name */}
          <div className="space-y-2">
            <Label htmlFor="studio_name" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Studio Name *
            </Label>
            <Input
              id="studio_name"
              name="studio_name"
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
              name="studio_tagline"
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
              name="google_maps_url"
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

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isPending}
              className="flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {initialData?.id ? 'Updating...' : 'Creating...'}
                </>
              ) : currentState.success ? (
                <>
                  <Check className="h-4 w-4" />
                  {initialData?.id ? 'Updated!' : 'Created!'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {initialData?.id ? 'Update Profile' : 'Create Profile'}
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

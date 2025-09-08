'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, RefreshCw, Building2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { calculateDistance } from '@/lib/coordinates';
import { createClient } from '@/lib/supabase/client';
import type { StudioProfile } from '@/lib/types';

interface UserLocationDisplayProps {
  className?: string;
}

interface NearestStudio {
  studio: StudioProfile;
  distance: number;
}

export function UserLocationDisplay({ className = "" }: UserLocationDisplayProps) {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearestStudio, setNearestStudio] = useState<NearestStudio | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findNearestStudio = async (userLocation: { latitude: number; longitude: number }) => {
    try {
      const supabase = createClient();
      const { data: studios, error } = await supabase
        .from('studio_profiles')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) {
        console.error('Error fetching studios:', error);
        return;
      }

      if (!studios || studios.length === 0) {
        return;
      }

      // Calculate distance to each studio and find the nearest one
      let nearest: NearestStudio | null = null;
      let minDistance = Infinity;

      studios.forEach((studio) => {
        if (studio.latitude && studio.longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            studio.latitude,
            studio.longitude
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            nearest = {
              studio: studio as StudioProfile,
              distance: distance
            };
          }
        }
      });

      setNearestStudio(nearest);
    } catch (err) {
      console.error('Error finding nearest studio:', err);
    }
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        });
      });

      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      
      setLocation(newLocation);
      await findNearestStudio(newLocation);

      toast.success('Location updated successfully', {
        description: 'Your current location has been retrieved',
        duration: 3000,
      });
    } catch (error: unknown) {
      let errorMessage = 'Unable to get your location';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
      }
      
      setError(errorMessage);
      toast.error('Location Error', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Current Location
        </CardTitle>
        <CardDescription>
          Your current geographical coordinates
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Getting your location...</span>
          </div>
        ) : error ? (
          <div className="space-y-3">
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
            <Button 
              onClick={getCurrentLocation}
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : location ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-muted-foreground">Latitude</div>
                <div className="font-mono text-lg">
                  {location.latitude.toFixed(6)}
                </div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Longitude</div>
                <div className="font-mono text-lg">
                  {location.longitude.toFixed(6)}
                </div>
              </div>
            </div>
            
            {/* Nearest Studio Information */}
            {nearestStudio && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">Nearest Studio: {nearestStudio.studio.studio_name}</span>
                </div>
                <div className="text-sm text-green-600 space-y-1">
                  <p><strong>Distance:</strong> {Math.round(nearestStudio.distance)}m</p>
                  {nearestStudio.studio.studio_tagline && (
                    <p><strong>Tagline:</strong> {nearestStudio.studio.studio_tagline}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    <strong>Studio Coordinates:</strong> {nearestStudio.studio.latitude?.toFixed(6)}, {nearestStudio.studio.longitude?.toFixed(6)}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full mt-2">
                  <a 
                    href={`https://www.google.com/maps?q=${nearestStudio.studio.latitude},${nearestStudio.studio.longitude}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Studio on Google Maps
                  </a>
                </Button>
              </div>
            )}
            
            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground mb-2">Your Location on Google Maps:</div>
              <a
                href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm break-all"
              >
                View on Google Maps
              </a>
            </div>

            <Button 
              onClick={getCurrentLocation}
              variant="outline" 
              size="sm"
              className="w-full mt-3"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Location
            </Button>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            No location data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}

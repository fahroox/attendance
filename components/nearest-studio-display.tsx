'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Building2, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import { calculateDistance } from '@/lib/coordinates';
import { createClient } from '@/lib/supabase/client';
import type { StudioProfile } from '@/lib/types';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface NearestStudio {
  studio: StudioProfile;
  distance: number;
}

export function NearestStudioDisplay() {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearestStudio, setNearestStudio] = useState<NearestStudio | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchUserLocation();
  }, []);

  const fetchUserLocation = () => {
    if (!isClient || !navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
        };
        setUserLocation(location);
        findNearestStudio(location);
        setIsLoading(false);
      },
      (err) => {
        let errorMessage = 'Unable to retrieve your location.';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const findNearestStudio = async (location: Location) => {
    try {
      const supabase = createClient();
      const { data: studios, error } = await supabase
        .from('studio_profiles')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) {
        console.error('Error fetching studios:', error);
        setError('Failed to fetch studio locations.');
        return;
      }

      if (!studios || studios.length === 0) {
        setError('No studio locations found.');
        return;
      }

      // Calculate distance to each studio and find the nearest one
      let nearest: NearestStudio | null = null;
      let minDistance = Infinity;

      studios.forEach((studio) => {
        if (studio.latitude && studio.longitude) {
          const distance = calculateDistance(
            location.latitude,
            location.longitude,
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
      setError('Failed to find nearest studio.');
    }
  };

  const googleMapsLink = nearestStudio
    ? `https://www.google.com/maps?q=${nearestStudio.studio.latitude},${nearestStudio.studio.longitude}`
    : '#';

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nearest Studio</CardTitle>
          <CardDescription>Initializing...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Nearest Studio
        </CardTitle>
        <CardDescription>Find the closest studio to your location.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Getting your location and finding nearest studio...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span>Error: {error}</span>
          </div>
        ) : nearestStudio ? (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{nearestStudio.studio.studio_name}</span>
              </div>
              <div className="text-sm text-green-600 space-y-1">
                <p><strong>Distance:</strong> {Math.round(nearestStudio.distance)}m</p>
                {nearestStudio.studio.studio_tagline && (
                  <p><strong>Tagline:</strong> {nearestStudio.studio.studio_tagline}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  <strong>Coordinates:</strong> {nearestStudio.studio.latitude?.toFixed(6)}, {nearestStudio.studio.longitude?.toFixed(6)}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild className="w-full">
              <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                View on Google Maps
              </a>
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No studio data available. Click "Refresh Location" to try again.</p>
          </div>
        )}
        
        <Button onClick={fetchUserLocation} disabled={isLoading} className="w-full" variant="outline">
          {isLoading ? 'Refreshing...' : 'Refresh Location'}
        </Button>
      </CardContent>
    </Card>
  );
}

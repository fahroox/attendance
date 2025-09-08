'use client';

import { useState, useEffect } from 'react';
import { fetchPublicStudioProfiles } from '@/lib/studio-client';
import { calculateDistance } from '@/lib/coordinates';
import type { StudioProfile } from '@/lib/types';
import { MapPin, Loader2, Building2 } from 'lucide-react';

interface NearestStudio {
  studio: StudioProfile;
  distance: number;
}

interface LandingStudioMatcherProps {
  className?: string;
}

export function LandingStudioMatcher({ className = "" }: LandingStudioMatcherProps) {
  const [studios, setStudios] = useState<StudioProfile[]>([]);
  const [nearestStudio, setNearestStudio] = useState<NearestStudio | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadStudios();
    // Automatically request location for testing
    requestLocationImmediately();
  }, []);

  const requestLocationImmediately = async () => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      return;
    }

    console.log('Automatically requesting location for testing...');
    setIsDetecting(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setUserLocation(location);
      console.log('User location obtained:', location);
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const loadStudios = async () => {
    try {
      setIsLoading(true);
      const studioData = await fetchPublicStudioProfiles();
      console.log('Loaded studios:', studioData);
      setStudios(studioData);
    } catch (error) {
      console.error('Failed to load studios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const findNearestStudio = async () => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      return;
    }

    console.log('Starting location detection...');
    setIsDetecting(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setUserLocation(location);
      console.log('User location:', location);
      console.log('Available studios:', studios);

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
          
          console.log(`Distance to ${studio.studio_name}: ${distance}m`);
          
          if (distance < minDistance) {
            minDistance = distance;
            nearest = {
              studio: studio,
              distance: distance
            };
          }
        }
      });

      console.log('Found nearest studio:', nearest);
      setNearestStudio(nearest);
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  // Auto-trigger location detection when studios are loaded
  useEffect(() => {
    console.log('Auto-trigger check:', { isClient, isLoading, studiosLength: studios.length, nearestStudio, isDetecting });
    if (isClient && !isLoading && studios.length > 0 && !nearestStudio && !isDetecting) {
      console.log('Triggering location detection...');
      // Small delay to ensure everything is ready
      const timer = setTimeout(() => {
        findNearestStudio();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isClient, isLoading, studios.length, nearestStudio, isDetecting]);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  // Show loading state while fetching studios
  if (isLoading) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-lg font-semibold">Loading Studios...</span>
        </div>
        {userLocation && (
          <div className="text-xs text-muted-foreground ml-6">
            Lat: {userLocation.latitude.toFixed(6)}, Lon: {userLocation.longitude.toFixed(6)}
          </div>
        )}
      </div>
    );
  }

  // Show detecting state
  if (isDetecting) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-lg font-semibold">Finding Nearby Studio...</span>
        </div>
        {userLocation && (
          <div className="text-xs text-muted-foreground ml-6">
            Lat: {userLocation.latitude.toFixed(6)}, Lon: {userLocation.longitude.toFixed(6)}
          </div>
        )}
      </div>
    );
  }

  // Show nearest studio
  if (nearestStudio) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-green-600" />
          <span className="text-lg font-semibold text-green-700 dark:text-green-400">
            {nearestStudio.studio.studio_name}
          </span>
        </div>
        {userLocation && (
          <div className="text-xs text-muted-foreground ml-6">
            Lat: {userLocation.latitude.toFixed(6)}, Lon: {userLocation.longitude.toFixed(6)}
          </div>
        )}
      </div>
    );
  }

  // Show default title when no studio is found or location not available
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-blue-600" />
        <span className="text-lg font-semibold">Design Studio Attendance</span>
      </div>
      {userLocation && (
        <div className="text-xs text-muted-foreground ml-6">
          Lat: {userLocation.latitude.toFixed(6)}, Lon: {userLocation.longitude.toFixed(6)}
        </div>
      )}
    </div>
  );
}

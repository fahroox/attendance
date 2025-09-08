'use client';

import { useState, useEffect } from 'react';
import { useLocationMatch } from '@/hooks/use-location-match';
import { fetchPublicStudioProfiles } from '@/lib/studio-client';
import { OutOfStudioPage } from './out-of-studio-page';
import type { StudioProfile } from '@/lib/types';

interface StudioLocationGuardProps {
  children: React.ReactNode;
}

export function StudioLocationGuard({ children }: StudioLocationGuardProps) {
  const [studios, setStudios] = useState<StudioProfile[]>([]);
  const [isLoadingStudios, setIsLoadingStudios] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [hasCheckedLocation, setHasCheckedLocation] = useState(false);

  const {
    matchedStudio,
    isDetecting,
    permissionStatus,
    requestPermission
  } = useLocationMatch(studios);

  useEffect(() => {
    setIsClient(true);
    loadStudios();
  }, []);

  const loadStudios = async () => {
    try {
      setIsLoadingStudios(true);
      const studioData = await fetchPublicStudioProfiles();
      setStudios(studioData);
    } catch (error) {
      console.error('Failed to load studios:', error);
    } finally {
      setIsLoadingStudios(false);
    }
  };

  // Auto-trigger location detection when permission is granted and studios are loaded
  useEffect(() => {
    if (isClient && !isLoadingStudios && studios.length > 0 && permissionStatus === 'granted' && !matchedStudio && !isDetecting && !hasCheckedLocation) {
      setHasCheckedLocation(true);
      // Small delay to ensure everything is ready
      const timer = setTimeout(() => {
        requestPermission();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isClient, isLoadingStudios, studios.length, permissionStatus, matchedStudio, isDetecting, hasCheckedLocation, requestPermission]);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading state while fetching studios
  if (isLoadingStudios) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading Studios...</p>
        </div>
      </div>
    );
  }

  // Show detecting state
  if (isDetecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground">Finding Nearby Studio...</p>
        </div>
      </div>
    );
  }

  // Show out of studio page if permission is granted but no studio found
  if (permissionStatus === 'granted' && hasCheckedLocation && !matchedStudio) {
    return <OutOfStudioPage />;
  }

  // Show the app if studio is found or if we haven't checked location yet
  return <>{children}</>;
}

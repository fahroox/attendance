'use client';

import { useState, useEffect } from 'react';
import { useLocationMatch } from '@/hooks/use-location-match';
import { fetchPublicStudioProfiles } from '@/lib/studio-client';
import type { StudioProfile } from '@/lib/types';
import { MapPin, MapPinOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface StudioLocationMatcherProps {
  onStudioMatched?: (studio: StudioProfile | null) => void;
  className?: string;
}

export function StudioLocationMatcher({ onStudioMatched, className = "" }: StudioLocationMatcherProps) {
  const [studios, setStudios] = useState<StudioProfile[]>([]);
  const [isLoadingStudios, setIsLoadingStudios] = useState(true);
  const [isClient, setIsClient] = useState(false);

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
      toast.error('Failed to load studio data', {
        description: 'Unable to fetch studio locations',
        duration: 5000,
      });
    } finally {
      setIsLoadingStudios(false);
    }
  };

  // Auto-trigger location detection when permission is granted and studios are loaded
  useEffect(() => {
    if (isClient && !isLoadingStudios && studios.length > 0 && permissionStatus === 'granted' && !matchedStudio && !isDetecting) {
      // Small delay to ensure everything is ready
      const timer = setTimeout(() => {
        requestPermission();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isClient, isLoadingStudios, studios.length, permissionStatus, matchedStudio, isDetecting, requestPermission]);

  // Notify parent component when studio match changes
  useEffect(() => {
    onStudioMatched?.(matchedStudio);
  }, [matchedStudio, onStudioMatched]);

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
  if (isLoadingStudios) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <span className="text-lg font-semibold">Loading Studios...</span>
      </div>
    );
  }

  // Show detecting state
  if (isDetecting) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <span className="text-lg font-semibold">Finding Nearby Studio...</span>
      </div>
    );
  }

  // Show matched studio
  if (matchedStudio) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <MapPin className="h-4 w-4 text-green-600" />
        <span className="text-lg font-semibold text-green-700 dark:text-green-400">
          {matchedStudio.studio_name}
        </span>
      </div>
    );
  }

  // Show out of studio message
  if (permissionStatus === 'granted' && !matchedStudio) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <MapPinOff className="h-4 w-4 text-orange-600" />
        <span className="text-lg font-semibold text-orange-700 dark:text-orange-400">
          You&apos;re out of studio, go ahead to your studio
        </span>
      </div>
    );
  }

  // Show default title for other states
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <MapPin className="h-4 w-4 text-blue-600" />
      <span className="text-lg font-semibold">Design Studio Attendance</span>
    </div>
  );
}

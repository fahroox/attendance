'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getUserLocation, findNearbyStudios, type UserLocation, type LocationMatch } from '@/lib/location';
import type { StudioProfile } from '@/lib/types';

interface UseLocationMatchResult {
  matchedStudio: StudioProfile | null;
  isDetecting: boolean;
  error: string | null;
  permissionStatus: 'unknown' | 'granted' | 'denied' | 'prompt';
  retryDetection: () => void;
  clearMatch: () => void;
  requestPermission: () => void;
}

/**
 * Hook for detecting user location and matching with nearby studios
 */
export function useLocationMatch(studios: StudioProfile[]): UseLocationMatchResult {
  const [matchedStudio, setMatchedStudio] = useState<StudioProfile | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');

  const detectLocationAndMatch = useCallback(async () => {
    if (studios.length === 0) {
      return;
    }

    setIsDetecting(true);
    setError(null);

    try {
      // Get user's current location
      const userLocation: UserLocation = await getUserLocation();
      setPermissionStatus('granted');
      
      // Find nearby studios within 500m
      const matches = findNearbyStudios(userLocation, studios, 500);
      
      if (matches.length > 0) {
        // Use the closest studio
        const closestMatch = matches[0];
        setMatchedStudio(closestMatch.studio);
        
        // Show success toast
        toast.success(`Studio Found!`, {
          description: `You're near ${closestMatch.studio.studio_name} (${Math.round(closestMatch.distance)}m away)`,
          duration: 5000,
        });
      } else {
        // No studios found within 500m
        setMatchedStudio(null);
        
        // Show info toast
        toast.info('No Studio Found', {
          description: 'No studios found within 500 meters of your location',
          duration: 4000,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to detect location';
      setError(errorMessage);
      
      // Check if it's a permission error
      if (errorMessage.includes('denied') || errorMessage.includes('permission')) {
        setPermissionStatus('denied');
      } else {
        setPermissionStatus('prompt');
      }
      
      // Show error toast
      toast.error('Location Detection Failed', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsDetecting(false);
    }
  }, [studios]);

  const retryDetection = useCallback(() => {
    detectLocationAndMatch();
  }, [detectLocationAndMatch]);

  const clearMatch = useCallback(() => {
    setMatchedStudio(null);
    setError(null);
  }, []);

  const requestPermission = useCallback(() => {
    detectLocationAndMatch();
  }, [detectLocationAndMatch]);

  // Check permission status on mount
  useEffect(() => {
    const checkPermissionStatus = async () => {
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          setPermissionStatus(permission.state);
        } catch (error) {
          setPermissionStatus('unknown');
        }
      } else {
        setPermissionStatus('unknown');
      }
    };

    checkPermissionStatus();
  }, []);

  return {
    matchedStudio,
    isDetecting,
    error,
    permissionStatus,
    retryDetection,
    clearMatch,
    requestPermission,
  };
}

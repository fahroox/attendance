'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocationMatch } from '@/hooks/use-location-match';
import { fetchPublicStudioProfiles } from '@/lib/studio-client';
import { LocationPermissionRequest } from '@/components/location-permission-request';
import type { StudioProfile } from '@/lib/types';
import { MapPin, RefreshCw, MapPinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationAwareHeaderProps {
  children?: React.ReactNode;
}

export function LocationAwareHeader({ children }: LocationAwareHeaderProps) {
  const [studios, setStudios] = useState<StudioProfile[]>([]);
  const [isLoadingStudios, setIsLoadingStudios] = useState(true);
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);
  
  const { 
    matchedStudio, 
    isDetecting, 
    error, 
    permissionStatus,
    retryDetection, 
    clearMatch, 
    requestPermission 
  } = useLocationMatch(studios);

  // Fetch studios on component mount
  useEffect(() => {
    const loadStudios = async () => {
      try {
        const studioProfiles = await fetchPublicStudioProfiles();
        setStudios(studioProfiles);
      } catch (error) {
        console.error('Failed to load studios:', error);
      } finally {
        setIsLoadingStudios(false);
      }
    };

    loadStudios();
  }, []);

  const displayTitle = matchedStudio ? matchedStudio.studio_name : 'Design Studio Attendance';
  const showLocationIcon = matchedStudio && !isDetecting;
  const showLocationOffIcon = permissionStatus === 'denied' && !matchedStudio;

  const handlePermissionGranted = () => {
    setShowPermissionRequest(false);
    requestPermission();
  };

  const handlePermissionDenied = () => {
    setShowPermissionRequest(false);
  };

  return (
    <>
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href={"/"} className="flex items-center gap-2">
              {showLocationIcon && (
                <MapPin className="h-4 w-4 text-green-600" />
              )}
              {showLocationOffIcon && (
                <MapPinOff className="h-4 w-4 text-red-500" />
              )}
              {displayTitle}
            </Link>
            
            {/* Location detection controls */}
            {!isLoadingStudios && studios.length > 0 && (
              <div className="flex items-center gap-2 ml-4">
                {isDetecting ? (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Detecting...
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={matchedStudio ? clearMatch : () => setShowPermissionRequest(true)}
                      className="h-6 px-2 text-xs"
                      disabled={!window.isSecureContext}
                    >
                      {matchedStudio ? 'Clear' : 'Find Studio'}
                    </Button>
                    {permissionStatus === 'denied' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPermissionRequest(true)}
                        className="h-6 px-2 text-xs text-red-600"
                      >
                        Enable Location
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {children}
        </div>
      </nav>

      {/* Permission Request Modal */}
      {showPermissionRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-md w-full">
            <LocationPermissionRequest
              onPermissionGranted={handlePermissionGranted}
              onPermissionDenied={handlePermissionDenied}
              isDetecting={isDetecting}
            />
            <div className="p-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowPermissionRequest(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, MapPinOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LocationAccessIndicatorProps {
  onLocationGranted?: () => void;
  onLocationDenied?: () => void;
  className?: string;
}

export function LocationAccessIndicator({ 
  onLocationGranted, 
  onLocationDenied,
  className = ""
}: LocationAccessIndicatorProps) {
  const [locationStatus, setLocationStatus] = useState<'checking' | 'granted' | 'denied' | 'unavailable' | 'not-secure' | 'prompt'>('checking');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    checkLocationSupport();
  }, []);

  // Auto-request permission when component mounts and conditions are met
  useEffect(() => {
    if (locationStatus === 'prompt' && !isRequesting) {
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        requestLocationAccess();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [locationStatus, isRequesting, requestLocationAccess]);

  const checkLocationSupport = async () => {
    // Check if we're in a secure context (HTTPS)
    if (!window.isSecureContext) {
      setLocationStatus('not-secure');
      return;
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      return;
    }

    // Check permission status if available
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        setLocationStatus(permission.state);
        
        // Listen for permission changes
        permission.addEventListener('change', () => {
          setLocationStatus(permission.state);
        });
      } catch {
        setLocationStatus('checking');
      }
    } else {
      setLocationStatus('checking');
    }
  };

  const requestLocationAccess = useCallback(async () => {
    if (!navigator.geolocation) {
      toast.error('Location Not Supported', {
        description: 'Your browser does not support location services',
        duration: 5000,
      });
      return;
    }

    setIsRequesting(true);

    try {
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        });
      });

      setLocationStatus('granted');
      toast.success('Location Access Granted', {
        description: 'We can now find nearby studios for you',
        duration: 3000,
      });
      
      onLocationGranted?.();
      } catch (error: unknown) {
        let errorMessage = 'Unable to access your location';
        
        if (error instanceof GeolocationPositionError) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationStatus('denied');
              errorMessage = 'Location access was denied. Please enable location permissions in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationStatus('unavailable');
              errorMessage = 'Location information is unavailable. Please check your device settings.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
        }
      
      toast.error('Location Access Failed', {
        description: errorMessage,
        duration: 6000,
      });
      
      onLocationDenied?.();
    } finally {
      setIsRequesting(false);
    }
  }, [onLocationGranted, onLocationDenied]);

  const getStatusIcon = () => {
    switch (locationStatus) {
      case 'granted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'denied':
        return <MapPinOff className="h-4 w-4 text-red-600" />;
      case 'unavailable':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'not-secure':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'prompt':
        return <MapPin className="h-4 w-4 text-yellow-600" />;
      case 'checking':
      default:
        return <MapPin className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusText = () => {
    switch (locationStatus) {
      case 'granted':
        return 'Location Access Granted';
      case 'denied':
        return 'Location Access Denied';
      case 'unavailable':
        return 'Location Unavailable';
      case 'not-secure':
        return 'HTTPS Required';
      case 'prompt':
        return 'Location Permission Needed';
      case 'checking':
      default:
        return 'Checking Location Access';
    }
  };

  const getButtonText = () => {
    if (isRequesting) return 'Requesting...';
    
    switch (locationStatus) {
      case 'granted':
        return 'Location Active';
      case 'denied':
        return 'Enable Location';
      case 'unavailable':
        return 'Check Settings';
      case 'not-secure':
        return 'HTTPS Required';
      case 'prompt':
        return 'Request Permission';
      case 'checking':
      default:
        return 'Request Location';
    }
  };

  const isButtonDisabled = () => {
    return isRequesting || locationStatus === 'granted' || locationStatus === 'not-secure';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {isRequesting ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        ) : (
          getStatusIcon()
        )}
        <span className="text-xs text-muted-foreground">
          {getStatusText()}
        </span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={requestLocationAccess}
        disabled={isButtonDisabled()}
        className="h-6 px-2 text-xs"
      >
        {getButtonText()}
      </Button>
    </div>
  );
}

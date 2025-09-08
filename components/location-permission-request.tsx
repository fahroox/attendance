'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LocationPermissionRequestProps {
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
  isDetecting: boolean;
}

export function LocationPermissionRequest({ 
  onPermissionGranted, 
  onPermissionDenied, 
  isDetecting 
}: LocationPermissionRequestProps) {
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');

  const handleRequestPermission = async () => {
    if (!navigator.geolocation) {
      toast.error('Location Not Supported', {
        description: 'Your browser does not support location services',
        duration: 5000,
      });
      onPermissionDenied();
      return;
    }

    try {
      // Check if we can get permission status
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        setPermissionStatus(permission.state);
        
        if (permission.state === 'denied') {
          toast.error('Location Permission Denied', {
            description: 'Please enable location access in your browser settings to use this feature',
            duration: 5000,
          });
          onPermissionDenied();
          return;
        }
      }

      // Request location permission
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPermissionStatus('granted');
          toast.success('Location Access Granted', {
            description: 'We can now find nearby studios for you',
            duration: 3000,
          });
          onPermissionGranted();
        },
        (error) => {
          setPermissionStatus('denied');
          let errorMessage = 'Unable to access your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied. Please enable location permissions in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please check your device settings.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          
          toast.error('Location Access Failed', {
            description: errorMessage,
            duration: 6000,
          });
          onPermissionDenied();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } catch (error) {
      setPermissionStatus('denied');
      toast.error('Location Permission Error', {
        description: 'An error occurred while requesting location access',
        duration: 5000,
      });
      onPermissionDenied();
    }
  };

  const getStatusIcon = () => {
    switch (permissionStatus) {
      case 'granted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'denied':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <MapPin className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusText = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'Location access granted';
      case 'denied':
        return 'Location access denied';
      default:
        return 'Location permission required';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          {getStatusIcon()}
        </div>
        <CardTitle className="text-lg">Find Nearby Studios</CardTitle>
        <CardDescription>
          Allow location access to automatically find studios near you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground space-y-2">
          <p>• We'll use your location to find studios within 500 meters</p>
          <p>• Your location is processed locally and not stored</p>
          <p>• You can manually select a studio if you prefer</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="text-muted-foreground">Your privacy is protected</span>
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleRequestPermission}
            disabled={isDetecting || permissionStatus === 'granted'}
            className="w-full"
          >
            {isDetecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Detecting Location...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Allow Location Access
              </>
            )}
          </Button>
          
          {permissionStatus === 'denied' && (
            <Button 
              variant="outline" 
              onClick={handleRequestPermission}
              className="w-full"
            >
              Try Again
            </Button>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Status: {getStatusText()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

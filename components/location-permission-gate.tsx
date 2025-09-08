'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUserRole } from '@/hooks/use-user-role';

interface LocationPermissionGateProps {
  children: React.ReactNode;
}

export function LocationPermissionGate({ children }: LocationPermissionGateProps) {
  const [permissionStatus, setPermissionStatus] = useState<'checking' | 'granted' | 'denied' | 'prompt' | 'unavailable' | 'not-secure'>('checking');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { isAdmin, isLoading: isUserLoading, user } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    checkLocationSupport();
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('Location permission gate timed out, allowing access');
      setHasTimedOut(true);
    }, 8000); // 8 second timeout
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Handle redirect to login when user is not authenticated
  useEffect(() => {
    if (!isUserLoading && !user && !isRedirecting && !hasTimedOut) {
      console.log('User not authenticated, redirecting to login');
      setIsRedirecting(true);
      // Use window.location for more stable redirect
      window.location.href = '/auth/login';
    }
  }, [isUserLoading, user, isRedirecting, hasTimedOut]);

  const checkLocationSupport = async () => {
    // Check if we're in a secure context (HTTPS)
    if (!window.isSecureContext) {
      setPermissionStatus('not-secure');
      return;
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setPermissionStatus('unavailable');
      return;
    }

    // Check permission status if available
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        setPermissionStatus(permission.state);
        
        // Listen for permission changes
        permission.addEventListener('change', () => {
          setPermissionStatus(permission.state);
        });
      } catch {
        setPermissionStatus('prompt');
      }
    } else {
      setPermissionStatus('prompt');
    }
  };

  const requestLocationAccess = async () => {
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

      setPermissionStatus('granted');
      toast.success('Location Access Granted', {
        description: 'Welcome! You can now access the app',
        duration: 3000,
      });
    } catch (error: unknown) {
      let errorMessage = 'Unable to access your location';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setPermissionStatus('denied');
            errorMessage = 'Location access was denied. Please enable location permissions in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            setPermissionStatus('unavailable');
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
    } finally {
      setIsRequesting(false);
    }
  };

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>
              Initializing application
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show loading state during user role check (with fallback)
  if (isUserLoading && !hasTimedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>
              Checking access requirements
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // If user role check is taking too long, allow access (fallback)
  if (isUserLoading && hasTimedOut) {
    console.log('User role check timed out, allowing access as fallback');
    return <>{children}</>;
  }

  // Show redirecting state when redirecting to login
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <CardTitle>Redirecting...</CardTitle>
            <CardDescription>
              Please log in to access the application
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Admin users bypass all location checks
  if (isAdmin) {
    console.log('Admin user detected, bypassing location checks');
    return <>{children}</>;
  }

  // If timed out, allow access (fallback)
  if (hasTimedOut) {
    console.log('Location permission gate timed out, allowing access');
    return <>{children}</>;
  }

  // If permission is granted, check if user is within studio range
  if (permissionStatus === 'granted') {
    // Check if user is within 500m of any studio
    // This will be handled by the StudioLocationMatcher component
    // For now, show the app and let StudioLocationMatcher handle the "out of studio" message
    return <>{children}</>;
  }

  // Show permission gate for all other states
  const getStatusInfo = () => {
    switch (permissionStatus) {
      case 'denied':
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-600" />,
          title: "Location Access Required",
          description: "You can't access the app unless you allow location permission",
          buttonText: "Allow Location Access",
          buttonVariant: "default" as const,
          showButton: true
        };
      case 'prompt':
        return {
          icon: <MapPin className="h-12 w-12 text-yellow-600" />,
          title: "Location Permission Needed",
          description: "This app requires location access to find nearby studios",
          buttonText: "Allow Location Access",
          buttonVariant: "default" as const,
          showButton: true
        };
      case 'unavailable':
        return {
          icon: <AlertTriangle className="h-12 w-12 text-orange-600" />,
          title: "Location Unavailable",
          description: "Your device doesn't support location services",
          buttonText: "Try Again",
          buttonVariant: "outline" as const,
          showButton: true
        };
      case 'not-secure':
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
          title: "HTTPS Required",
          description: "Location features require a secure connection (HTTPS)",
          buttonText: "Deploy to HTTPS",
          buttonVariant: "outline" as const,
          showButton: false
        };
      case 'checking':
      default:
        return {
          icon: <Loader2 className="h-12 w-12 animate-spin text-blue-600" />,
          title: "Checking Location Access",
          description: "Verifying location permissions...",
          buttonText: "Allow Location Access",
          buttonVariant: "default" as const,
          showButton: false
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {statusInfo.icon}
          </div>
          <CardTitle className="text-2xl">{statusInfo.title}</CardTitle>
          <CardDescription className="text-base">
            {statusInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {statusInfo.showButton && (
            <div className="text-center">
              <Button
                onClick={requestLocationAccess}
                disabled={isRequesting || permissionStatus === 'checking'}
                variant={statusInfo.buttonVariant}
                size="lg"
                className="w-full"
              >
                {isRequesting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    {statusInfo.buttonText}
                  </>
                )}
              </Button>
            </div>
          )}

          {permissionStatus === 'denied' && (
            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-sm text-red-800 dark:text-red-200">
                <p className="font-medium mb-2">How to enable location access:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Click the location icon in your browser&apos;s address bar</li>
                  <li>• Select &quot;Allow&quot; for location access</li>
                  <li>• Refresh the page after enabling</li>
                </ul>
              </div>
            </div>
          )}

          {permissionStatus === 'not-secure' && (
            <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="text-sm text-orange-800 dark:text-orange-200">
                <p className="font-medium mb-2">For local development:</p>
                <p className="text-xs">
                  Location features work on deployed HTTPS URLs. Deploy your app to test the full functionality.
                </p>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              This app uses location to find nearby design studios within 500 meters
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

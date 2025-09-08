'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UserLocationDisplayProps {
  className?: string;
}

export function UserLocationDisplay({ className = "" }: UserLocationDisplayProps) {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

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
          <div className="space-y-3">
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
            
            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground mb-2">Google Maps Link:</div>
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

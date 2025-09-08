'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Shield, Zap } from 'lucide-react';

export function LocationFeatureInfo() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <MapPin className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Smart Studio Detection</CardTitle>
        <CardDescription>
          Our system can automatically detect nearby studios when you allow location access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-sm">Auto-Detection</h3>
            <p className="text-xs text-muted-foreground">
              Automatically finds studios within 500 meters of your location
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-sm">Privacy Protected</h3>
            <p className="text-xs text-muted-foreground">
              Your location is processed locally and never stored on our servers
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Zap className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-sm">Instant Matching</h3>
            <p className="text-xs text-muted-foreground">
              Get matched with the closest studio in real-time
            </p>
          </div>
        </div>
        
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            Click "Find Studio" in the header to get started, or manually select your studio from the admin panel.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            💡 Location features work on deployed HTTPS URLs. Deploy to test the full functionality.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

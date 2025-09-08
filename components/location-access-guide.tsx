'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export function LocationAccessGuide() {
  const isSecureContext = typeof window !== 'undefined' ? window.isSecureContext : false;
  const hasGeolocation = typeof navigator !== 'undefined' ? 'geolocation' in navigator : false;

  const getStatusInfo = () => {
    if (!isSecureContext) {
      return {
        icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
        title: "HTTPS Required",
        description: "Location features require a secure connection (HTTPS)",
        status: "error",
        action: "Deploy to HTTPS URL"
      };
    }

    if (!hasGeolocation) {
      return {
        icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support location services",
        status: "warning",
        action: "Use Modern Browser"
      };
    }

    return {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      title: "Ready for Location Access",
      description: "Your browser supports location services",
      status: "success",
      action: "Request Location Access"
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          {statusInfo.icon}
        </div>
        <CardTitle className="text-xl">Location Access Status</CardTitle>
        <CardDescription>
          {statusInfo.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Overview */}
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-2">{statusInfo.title}</h3>
          <p className="text-sm text-muted-foreground">
            Current environment: {typeof window !== 'undefined' ? window.location.protocol : 'Unknown'}
          </p>
        </div>

        {/* Requirements Checklist */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Requirements Checklist:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {isSecureContext ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">Secure Context (HTTPS)</span>
            </div>
            <div className="flex items-center gap-2">
              {hasGeolocation ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">Geolocation API Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm">User Permission</span>
            </div>
          </div>
        </div>

        {/* Auto-request Info */}
        {statusInfo.status === 'success' && (
          <div className="text-center">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Auto-Request Enabled
                </span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                Location permission will be requested automatically when you visit any page
              </p>
            </div>
          </div>
        )}

        {/* Help Information */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">How Location Features Work:</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• We detect your current location using your browser&apos;s GPS</li>
            <li>• We find studios within 500 meters of your position</li>
            <li>• Your location is processed locally and never stored</li>
            <li>• You can revoke access anytime in your browser settings</li>
          </ul>
        </div>

        {/* Browser Support */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Supported Browsers:</p>
          <div className="flex justify-center gap-4 text-xs">
            <span>Chrome ✓</span>
            <span>Firefox ✓</span>
            <span>Safari ✓</span>
            <span>Edge ✓</span>
          </div>
        </div>

        {/* Deployment Note */}
        {!isSecureContext && (
          <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                  Deploy to Test Location Features
                </p>
                <p className="text-orange-700 dark:text-orange-300 text-xs">
                  Location features work on deployed HTTPS URLs. Deploy your app to Vercel, Netlify, or any HTTPS hosting service to test the full functionality.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

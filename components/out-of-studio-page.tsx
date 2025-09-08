'use client';

import { MapPinOff } from 'lucide-react';

export function OutOfStudioPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <MapPinOff className="h-16 w-16 text-orange-600" />
        </div>
        <h1 className="text-2xl font-semibold text-orange-700 dark:text-orange-400">
          You&apos;re out of studio, go ahead to your studio
        </h1>
        <p className="text-muted-foreground max-w-md">
          You need to be within 500 meters of a registered studio to access the attendance system.
        </p>
      </div>
    </div>
  );
}

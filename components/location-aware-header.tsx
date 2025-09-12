'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LocationPermissionRequest } from '@/components/location-permission-request';
import { LandingStudioMatcher } from '@/components/landing-studio-matcher';

interface LocationAwareHeaderProps {
  children?: React.ReactNode;
}

export function LocationAwareHeader({ children }: LocationAwareHeaderProps) {
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);
  const isDetecting = false; // Static value since we're not tracking detection state in this component

  const handlePermissionGranted = () => {
    setShowPermissionRequest(false);
  };

  const handlePermissionDenied = () => {
    setShowPermissionRequest(false);
  };

  return (
    <>
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href="/" className="flex items-center gap-2">
              <LandingStudioMatcher 
                className="flex items-center gap-2"
              />
            </Link>
            
          </div>
          {children}
        </div>
      </nav>

      {/* Location Permission Request Modal */}
      {showPermissionRequest && (
        <LocationPermissionRequest
          onPermissionGranted={handlePermissionGranted}
          onPermissionDenied={handlePermissionDenied}
          isDetecting={isDetecting}
        />
      )}
    </>
  );
}
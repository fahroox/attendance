'use client';

import { usePathname } from 'next/navigation';
import { LocationPermissionGate } from './location-permission-gate';
import { StudioLocationGuard } from './studio-location-guard';

interface ConditionalLocationGateProps {
  children: React.ReactNode;
}

export function ConditionalLocationGate({ children }: ConditionalLocationGateProps) {
  const pathname = usePathname();
  
  // Pages that don't require location permission
  const exemptPages = [
    '/auth/login',
    '/auth/sign-up',
    '/auth/forgot-password',
    '/auth/update-password',
    '/auth/error',
    '/auth/confirm',
    '/auth/sign-up-success'
  ];
  
  // Check if current page is exempt from location requirement
  const isExemptPage = exemptPages.some(page => pathname.startsWith(page));
  
  // If it's an exempt page, show children directly
  if (isExemptPage) {
    return <>{children}</>;
  }
  
  // For all other pages, wrap with location permission gate and studio location guard
  return (
    <LocationPermissionGate>
      <StudioLocationGuard>
        {children}
      </StudioLocationGuard>
    </LocationPermissionGate>
  );
}

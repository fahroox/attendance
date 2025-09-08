'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogoutButton } from '@/components/logout-button';
import { useLocationMatch } from '@/hooks/use-location-match';
import { fetchPublicStudioProfiles } from '@/lib/studio-client';
import type { StudioProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X, Menu, User, MapPin, RefreshCw } from 'lucide-react';
import type { AuthUser } from '@/lib/types';

interface LocationAwareDashboardSidebarProps {
  user: AuthUser;
}

export function LocationAwareDashboardSidebar({ user }: LocationAwareDashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [studios, setStudios] = useState<StudioProfile[]>([]);
  const [isLoadingStudios, setIsLoadingStudios] = useState(true);
  const router = useRouter();
  
  const { 
    matchedStudio, 
    isDetecting, 
    permissionStatus,
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

  const handleLogout = async () => {
    await router.push('/auth/login');
  };

  const displayStudioName = matchedStudio ? matchedStudio.studio_name : 'Design Studio';
  const showLocationIcon = matchedStudio && !isDetecting;

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              {showLocationIcon && (
                <MapPin className="h-4 w-4 text-green-600" />
              )}
              <h2 className="text-xl font-bold">{displayStudioName}</h2>
            </div>
            <p className="text-sm text-muted-foreground">Attendance System</p>
            
            {/* Location detection controls */}
            {!isLoadingStudios && studios.length > 0 && (
              <div className="mt-2 space-y-1">
                {isDetecting ? (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Detecting...
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={matchedStudio ? clearMatch : requestPermission}
                      className="h-6 px-2 text-xs w-full justify-start"
                    >
                      {matchedStudio ? 'Clear Match' : 'Find Studio'}
                    </Button>
                    {permissionStatus === 'denied' && (
                      <div className="text-xs text-red-500">
                        Location access denied
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.full_name || user.email}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Main
              </p>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  router.push('/dashboard');
                  setIsOpen(false);
                }}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  router.push('/reports');
                  setIsOpen(false);
                }}
              >
                Reports
              </Button>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Account
              </p>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  router.push('/account');
                  setIsOpen(false);
                }}
              >
                Account
              </Button>
              <LogoutButton onLogout={handleLogout} />
            </div>

            {/* Admin-only section */}
            {user.role === 'admin' && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Admin
                </p>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push('/admin');
                    setIsOpen(false);
                  }}
                >
                  Admin Panel
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push('/studio-profile');
                    setIsOpen(false);
                  }}
                >
                  Studio Profile
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

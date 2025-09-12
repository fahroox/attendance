'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogoutButton } from '@/components/logout-button';
import { X, Menu, Building2 } from 'lucide-react';

interface LocationAwareDashboardSidebarProps {
  user: {
    id: string;
    email: string;
    role: string;
    full_name: string;
  };
}

export function LocationAwareDashboardSidebar({ user }: LocationAwareDashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-background border border-border shadow-md"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={closeSidebar}>
              <Building2 className="h-5 w-5" />
              <span className="font-semibold">Design Studio</span>
            </Link>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-1 rounded-md hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
              onClick={closeSidebar}
            >
              Dashboard
            </Link>

            {user.role === 'admin' && (
              <>
                <Link
                  href="/studio-profile"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                  onClick={closeSidebar}
                >
                  Studio Profile
                </Link>
                <Link
                  href="/users"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                >
                  Users
                </Link>
              </>
            )}

            <Link
              href="/reports"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
              onClick={closeSidebar}
            >
              Reports
            </Link>

            <Link
              href="/account"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
              onClick={closeSidebar}
            >
              Account
            </Link>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
              {user.full_name || user.email}
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
}
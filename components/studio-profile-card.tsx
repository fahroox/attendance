"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudioProfile } from "@/lib/types";
import { Building2, Edit, Trash2, MapPin, Calendar } from "lucide-react";
import { showDeleteConfirmationToast } from "@/lib/toast";
import { deleteStudioProfile } from "@/app/studio-profile/actions";

interface StudioProfileCardProps {
  profile: StudioProfile;
  onEdit: (profile: StudioProfile) => void;
  onDelete: (profileId: string) => void;
  isDeleting?: boolean;
  disabled?: boolean;
}

export function StudioProfileCard({ 
  profile, 
  onEdit, 
  onDelete, 
  isDeleting = false,
  disabled = false 
}: StudioProfileCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = () => {
    if (!profile.id) return;
    
    showDeleteConfirmationToast({
      itemName: profile.studio_name,
      itemType: "studio profile",
      onConfirm: async () => {
        try {
          const result = await deleteStudioProfile({}, profile.id!);
          if (result.success) {
            onDelete(profile.id!);
          }
        } catch (error) {
          console.error('Error deleting profile:', error);
        }
      }
    });
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {profile.studio_name}
            </CardTitle>
            {profile.studio_tagline && (
              <CardDescription className="mt-1">
                {profile.studio_tagline}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Location Info */}
          {profile.google_maps_url && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <a 
                  href={profile.google_maps_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View on Google Maps
                </a>
                {profile.latitude && profile.longitude && (
                  <div className="text-xs mt-1">
                    {profile.latitude.toFixed(6)}, {profile.longitude.toFixed(6)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              Created: {profile.created_at ? formatDate(profile.created_at) : 'Unknown'}
            </span>
          </div>
          {profile.updated_at && profile.updated_at !== profile.created_at && (
            <div className="text-xs text-muted-foreground">
              Updated: {formatDate(profile.updated_at)}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(profile)}
              disabled={disabled}
              className="flex-1"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting || disabled}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {isDeleting ? (
                <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

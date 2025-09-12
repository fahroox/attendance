"use client";

import { useState, useOptimistic, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudioProfileCard } from "@/components/studio-profile-card";
import { StudioProfileFormWithActions } from "@/components/studio-profile-form-with-actions";
import { StudioProfile } from "@/lib/types";
import { Building2, Plus } from "lucide-react";
import { showDeleteSuccessToast } from "@/lib/toast";

interface StudioProfilesManagerWithActionsProps {
  initialProfiles: StudioProfile[];
}

export function StudioProfilesManagerWithActions({ 
  initialProfiles 
}: StudioProfilesManagerWithActionsProps) {
  const [profiles, setProfiles] = useState<StudioProfile[]>(initialProfiles);
  const [editingProfile, setEditingProfile] = useState<StudioProfile | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [isPending] = useTransition();

  // Optimistic updates for better UX
  const [optimisticProfiles] = useOptimistic(
    profiles,
    (state, newProfile: StudioProfile) => {
      if (editingProfile?.id) {
        // Update existing profile
        return state.map(profile => 
          profile.id === editingProfile.id ? newProfile : profile
        );
      } else {
        // Add new profile
        return [newProfile, ...state];
      }
    }
  );

  const handleProfileSaved = (savedProfile: StudioProfile) => {
    // Update the actual state with the saved profile
    if (editingProfile?.id) {
      setProfiles(prev => 
        prev.map(profile => 
          profile.id === editingProfile.id ? savedProfile : profile
        )
      );
    } else {
      setProfiles(prev => [savedProfile, ...prev]);
    }
    
    setEditingProfile(null);
    setShowNewForm(false);
  };

  const handleEditProfile = (profile: StudioProfile) => {
    setEditingProfile(profile);
    setShowNewForm(false);
  };

  const handleDeleteProfile = (profileId: string) => {
    // Optimistically remove from UI
    setProfiles(prev => prev.filter(profile => profile.id !== profileId));
    
    // If we were editing this profile, clear the editing state
    if (editingProfile?.id === profileId) {
      setEditingProfile(null);
    }
    
    // Show success message
    const deletedProfile = profiles.find(p => p.id === profileId);
    if (deletedProfile) {
      showDeleteSuccessToast(deletedProfile.studio_name, "studio profile");
    }
  };

  const handleCancelEdit = () => {
    setEditingProfile(null);
    setShowNewForm(false);
  };

  return (
    <>
    <div className="mb-8">
      <h1 className="text-3xl font-bold">Studio Profiles</h1>
      <p className="text-muted-foreground">
      Manage your design studio profiles and information
      </p>
    </div>
    
    <div className="space-y-6">
        {/* Header with Add New Button */}
        <div className="flex justify-between items-center">
          {/* Header with Create Button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">All Studio</h2>
            <span className="text-sm text-muted-foreground">({profiles.length})</span>
          </div>
        </div>
          <Button
            onClick={() => {
              setShowNewForm(true);
              setEditingProfile(null);
            } }
            className="flex items-center gap-2"
            disabled={showNewForm || editingProfile !== null || isPending}
          >
            <Plus className="h-4 w-4" />
            Add New Studio
          </Button>
        </div>

        {/* New Studio Form */}
        {showNewForm && (
          <StudioProfileFormWithActions
            initialData={null}
            onSuccess={handleProfileSaved}
            onCancel={handleCancelEdit} />
        )}

        {/* Edit Studio Form */}
        {editingProfile && (
          <StudioProfileFormWithActions
            initialData={editingProfile}
            onSuccess={handleProfileSaved}
            onCancel={handleCancelEdit} />
        )}

        {/* Existing Studio Profiles List */}
        {optimisticProfiles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {optimisticProfiles.map((profile) => (
              <StudioProfileCard
                key={profile.id}
                profile={profile}
                onEdit={handleEditProfile}
                onDelete={handleDeleteProfile}
                isDeleting={false}
                disabled={showNewForm || editingProfile !== null || isPending} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Studio Profiles</h3>
              <p className="text-muted-foreground text-center mb-4">
                You haven&apos;t created any studio profiles yet. Click the &quot;Add New Studio&quot; button to get started.
              </p>
              <Button
                onClick={() => {
                  setShowNewForm(true);
                  setEditingProfile(null);
                } }
                className="flex items-center gap-2"
                disabled={isPending}
              >
                <Plus className="h-4 w-4" />
                Create Your First Studio Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </div></>
  );
}

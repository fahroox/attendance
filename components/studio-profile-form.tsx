"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Check, Building2, Tag, MapPin } from "lucide-react";
// import { toast } from "sonner";

interface StudioProfile {
  id?: string;
  studio_name: string;
  studio_tagline: string | null;
  address: string | null;
  created_at?: string;
  updated_at?: string;
}

interface StudioProfileFormProps {
  initialData?: StudioProfile | null;
}

export function StudioProfileForm({ initialData }: StudioProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    studio_name: initialData?.studio_name || "",
    studio_tagline: initialData?.studio_tagline || "",
    address: initialData?.address || "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const supabase = createClient();
      
      // Validate required fields
      if (!formData.studio_name.trim()) {
        alert("Studio name is required");
        setIsLoading(false);
        return;
      }

      const profileData = {
        studio_name: formData.studio_name.trim(),
        studio_tagline: formData.studio_tagline.trim() || null,
        address: formData.address.trim() || null,
      };

      if (initialData?.id) {
        // Update existing profile
        const { error } = await supabase
          .from('studio_profiles')
          .update(profileData)
          .eq('id', initialData.id);

        if (error) throw error;
        
        console.log("Studio profile updated successfully!");
      } else {
        // Create new profile
        const { error } = await supabase
          .from('studio_profiles')
          .insert(profileData);

        if (error) throw error;
        
        console.log("Studio profile created successfully!");
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        router.refresh();
      }, 2000);

    } catch (error) {
      console.error('Error saving studio profile:', error);
      alert("Failed to save studio profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Studio Information
        </CardTitle>
        <CardDescription>
          Manage your design studio information and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Studio Name */}
          <div className="space-y-2">
            <Label htmlFor="studio_name" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Studio Name *
            </Label>
            <Input
              id="studio_name"
              type="text"
              placeholder="Enter your studio name"
              value={formData.studio_name}
              onChange={(e) => handleInputChange('studio_name', e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Studio Tagline */}
          <div className="space-y-2">
            <Label htmlFor="studio_tagline" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Studio Tagline
            </Label>
            <Input
              id="studio_tagline"
              type="text"
              placeholder="Enter your studio tagline"
              value={formData.studio_tagline}
              onChange={(e) => handleInputChange('studio_tagline', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Textarea
              id="address"
              placeholder="Enter your studio address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full min-h-[100px]"
            />
          </div>

          {/* Save Button */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            
            {isSuccess && (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm">Changes saved successfully!</span>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useTransition } from "react";
import { UserProfile } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { createUser, updateUser, ActionState } from "@/app/users/actions";
import { toast } from "sonner";

interface UserFormWithActionsProps {
  initialData?: UserProfile | null;
  onSuccess?: (user: UserProfile) => void;
  onCancel?: () => void;
}

export function UserFormWithActions({ 
  initialData, 
  onSuccess, 
  onCancel 
}: UserFormWithActionsProps) {
  const [formData, setFormData] = useState({
    email: initialData?.email || '',
    full_name: initialData?.full_name || '',
    role: initialData?.role || 'team' as 'admin' | 'team'
  });
  
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      let result: ActionState;
      
      if (initialData) {
        // Update existing user
        const updateFormData = new FormData();
        updateFormData.append('id', initialData.id);
        updateFormData.append('email', formData.get('email') as string);
        updateFormData.append('full_name', formData.get('full_name') as string);
        updateFormData.append('role', formData.get('role') as string);
        
        result = await updateUser({}, updateFormData);
      } else {
        // Create new user
        result = await createUser({}, formData);
      }
      
      if (result.success && result.data) {
        onSuccess?.(result.data as UserProfile);
        toast.success(initialData ? "User updated successfully" : "User created successfully");
      } else {
        toast.error(result.error || "Operation failed");
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="user@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            disabled={isPending}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            placeholder="John Doe"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <Select
          name="role"
          value={formData.role}
          onValueChange={(value) => handleInputChange('role', value)}
          disabled={isPending}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="team">Team Member</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          type="submit" 
          disabled={isPending}
          className="flex-1"
        >
          {isPending ? 'Saving...' : (initialData ? 'Update User' : 'Create User')}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isPending}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

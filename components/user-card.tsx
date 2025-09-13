"use client";

import { UserProfile } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Edit, Trash2, Mail, User, Calendar } from "lucide-react";

interface UserCardProps {
  user: UserProfile;
  onEdit: (user: UserProfile) => void;
  onDelete: (userId: string) => void;
  isDeleting?: boolean;
  disabled?: boolean;
}

export function UserCard({ 
  user, 
  onEdit, 
  onDelete, 
  isDeleting = false,
  disabled = false 
}: UserCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = () => {
    onDelete(user.id);
  };

  const handleEdit = () => {
    onEdit(user);
  };

  return (
    <Card className={`transition-all duration-200 ${isDeleting ? 'opacity-50' : 'hover:shadow-md'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">
              {user.full_name || 'No Name'}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Mail className="h-3 w-3" />
              <span className="truncate">{user.email}</span>
            </CardDescription>
          </div>
          <Badge 
            variant={user.role === 'admin' ? 'destructive' : 'default'}
            className="ml-2"
          >
            {user.role}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* User Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>ID: {user.id.slice(0, 8)}...</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Joined {formatDate(user.created_at)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              disabled={disabled || isDeleting}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={disabled || isDeleting}
              className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useTransition } from "react";
import { UserProfile } from "@/lib/types";
import { UserCard } from "./user-card";
import { UserFormWithActions } from "./user-form-with-actions";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Plus, Users } from "lucide-react";
import { deleteUser } from "@/app/users/actions";
import { toast } from "sonner";

interface UsersManagerWithActionsProps {
  initialUsers: UserProfile[];
}

export function UsersManagerWithActions({ 
  initialUsers 
}: UsersManagerWithActionsProps) {
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUserSaved = (savedUser: UserProfile) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === savedUser.id ? savedUser : user
      ));
      setEditingUser(null);
      toast.success("User updated successfully");
    } else {
      // Add new user
      setUsers(prev => [savedUser, ...prev]);
      setIsCreating(false);
      toast.success("User created successfully");
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setIsCreating(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setDeletingUserId(userId);
      
      startTransition(async () => {
        const result = await deleteUser({}, userId);
        
        if (result.success) {
          setUsers(prev => prev.filter(user => user.id !== userId));
          toast.success("User deleted successfully");
        } else {
          toast.error(result.error || "Failed to delete user");
        }
        
        setDeletingUserId(null);
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-semibold">All Users</h2>
          <span className="text-sm text-muted-foreground">({users.length})</span>
        </div>
        <Button onClick={handleCreateNew} disabled={isPending}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingUser) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingUser ? "Edit User" : "Create New User"}
            </CardTitle>
            <CardDescription>
              {editingUser 
                ? "Update user information and role" 
                : "Add a new team member to your studio"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserFormWithActions
              initialData={editingUser}
              onSuccess={handleUserSaved}
              onCancel={handleCancelEdit}
            />
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      {users.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              isDeleting={deletingUserId === user.id}
              disabled={isPending}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by adding your first team member
            </p>
            <Button onClick={handleCreateNew} disabled={isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Add First User
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

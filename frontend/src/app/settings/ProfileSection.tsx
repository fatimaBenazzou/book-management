"use client";

import { useState } from "react";
import { User, Mail, Phone, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAppDispatch } from "@/lib/store";
import { updateUser } from "@/lib/store/slices/user";
import { useUpdateProfile } from "@/lib/hooks/useAuth";
import { getInitials } from "@/lib/utils/format";

type ProfileSectionProps = {
  user: UserI;
};

export function ProfileSection({ user }: ProfileSectionProps) {
  const dispatch = useAppDispatch();
  const updateProfileMutation = useUpdateProfile();

  const [profileForm, setProfileForm] = useState({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    phone: user.phone ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfileMutation.mutateAsync({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
      });

      dispatch(
        updateUser({
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          phone: profileForm.phone,
        }),
      );
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const fullName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar display */}
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt={fullName} />
            <AvatarFallback className="text-xl">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{fullName}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="firstName"
                  name="firstName"
                  value={profileForm.firstName}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Enter your first name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="lastName"
                  name="lastName"
                  value={profileForm.lastName}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-muted pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={profileForm.phone}
                onChange={handleChange}
                className="pl-10"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <Button type="submit" disabled={updateProfileMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateProfileMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

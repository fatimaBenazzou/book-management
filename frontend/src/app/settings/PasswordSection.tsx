"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useChangePassword } from "@/lib/hooks/useAuth";
import { PasswordField } from "./PasswordField";

export function PasswordSection() {
  const changePasswordMutation = useChangePassword();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (form.newPassword.length < 8) {
      toast.error(
        "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 digit",
      );
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      toast.success("Password updated");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      toast.error("Failed to change password");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordField
            id="currentPassword"
            label="Current Password"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
          />
          <PasswordField
            id="newPassword"
            label="New Password"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            minLength={8}
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm New Password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            minLength={8}
          />

          <Button type="submit" disabled={changePasswordMutation.isPending}>
            <Lock className="mr-2 h-4 w-4" />
            {changePasswordMutation.isPending
              ? "Updating..."
              : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

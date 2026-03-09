import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchUserProfile } from "@/lib/api/server";
import { ProfileSection } from "./ProfileSection";
import { PasswordSection } from "./PasswordSection";
import { DangerZoneSection } from "./DangerZoneSection";

export const metadata: Metadata = {
  title: "Settings | Book Management Library",
  description: "Manage your account settings, profile, and password.",
};

export default async function SettingsPage() {
  const user = await fetchUserProfile();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <ProfileSection user={user} />

      <PasswordSection />

      <DangerZoneSection />
    </div>
  );
}

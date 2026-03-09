"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="container mx-auto flex h-[60vh] items-center justify-center p-4">
      <div className="max-w-md space-y-4 text-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {error.message || "Failed to load the home page."}
          </AlertDescription>
        </Alert>
        <Button onClick={reset} type="button">
          Try again
        </Button>
      </div>
    </section>
  );
}

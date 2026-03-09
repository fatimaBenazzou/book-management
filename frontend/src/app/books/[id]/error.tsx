"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function BookDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex h-[60vh] items-center justify-center p-4">
      <div className="max-w-md space-y-4 text-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load book</AlertTitle>
          <AlertDescription>
            {error.message || "Something went wrong."}
          </AlertDescription>
        </Alert>
        <Button onClick={reset} type="button">
          Try again
        </Button>
      </div>
    </div>
  );
}

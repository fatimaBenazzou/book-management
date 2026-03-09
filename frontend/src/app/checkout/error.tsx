"use client";

import { Button } from "@/components/ui/button";

export default function CheckoutError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground">
        We couldn&apos;t load the checkout page. Please try again.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}

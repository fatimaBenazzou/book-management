import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="container mx-auto space-y-6 p-4">
      <Skeleton className="h-9 w-40" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function MyShelfLoading() {
  return (
    <div className="container mx-auto space-y-6 p-4">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-full sm:w-96" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    </div>
  );
}

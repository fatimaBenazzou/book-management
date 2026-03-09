import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryDetailLoading() {
  return (
    <div className="container mx-auto space-y-8 p-4">
      <Skeleton className="h-9 w-32" />

      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-20" />
      </div>

      <div>
        <Skeleton className="mb-4 h-8 w-56" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-2/3 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

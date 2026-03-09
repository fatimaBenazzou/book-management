import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <section className="container mx-auto h-full space-y-8 p-4">
      {/* Quotes skeleton */}
      <Skeleton className="h-40 w-full rounded-xl" />

      {/* Greeting skeleton */}
      <Skeleton className="h-10 w-64" />

      {/* Carousel section skeletons */}
      {Array.from({ length: 3 }).map((_, sectionIdx) => (
        <div key={sectionIdx} className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-1/5 shrink-0 space-y-2">
                <Skeleton className="aspect-2/3 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

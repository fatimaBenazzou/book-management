import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthorLoading() {
  return (
    <div className="container mx-auto space-y-8 p-4">
      <Skeleton className="h-9 w-32" />

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <Skeleton className="h-28 w-28 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      <div>
        <Skeleton className="mb-4 h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-2/3" />
              <CardContent className="space-y-2 p-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

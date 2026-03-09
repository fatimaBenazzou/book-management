import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function SearchLoading() {
  return (
    <div className="container mx-auto space-y-6 p-4">
      <Skeleton className="h-10 w-48" />
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
      <Skeleton className="h-5 w-32" />
      <Card>
        <CardContent className="p-0">
          <div className="p-8">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-12" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

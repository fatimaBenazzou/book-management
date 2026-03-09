import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function BookDetailLoading() {
  return (
    <div className="container mx-auto space-y-6 p-4">
      <Skeleton className="h-10 w-24" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        <div className="md:col-span-1 lg:col-span-3">
          <Card className="overflow-hidden">
            <Skeleton className="aspect-2/3" />
            <CardContent className="space-y-2 p-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4 md:col-span-1 lg:col-span-6">
          <Card>
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-10 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-10" />
              </div>
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="hidden lg:col-span-3 lg:block">
          <Card>
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

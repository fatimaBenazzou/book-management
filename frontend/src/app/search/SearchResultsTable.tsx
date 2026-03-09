import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookRow } from "./BookRow";

interface SearchResultsTableProps {
  books: BookI[];
  isLoading: boolean;
}

export function SearchResultsTable({
  books,
  isLoading,
}: SearchResultsTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        {isLoading ? (
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
        ) : books.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg text-muted-foreground">No books found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left font-medium">Title</th>
                  <th className="p-4 text-left font-medium">Ratings</th>
                  <th className="p-4 text-left font-medium">Category</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <BookRow key={book._id} book={book} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

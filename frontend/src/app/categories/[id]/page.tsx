import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchCategoryById, fetchBooksByCategory } from "@/lib/api/server";
import { StarRating } from "@/components/shared/StarRating";

interface CategoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const category = await fetchCategoryById(id);
  if (!category) {
    return { title: "Category Not Found | Book Management Library" };
  }
  return {
    title: `${category.name} | Book Management Library`,
    description: `Browse books in the ${category.name} category`,
  };
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { id } = await params;
  const [category, booksResponse] = await Promise.all([
    fetchCategoryById(id),
    fetchBooksByCategory(id, { limit: 50 }).catch(() => null),
  ]);

  if (!category) {
    notFound();
  }

  const books = booksResponse?.data ?? [];

  return (
    <div className="container mx-auto space-y-8 p-4">
      <Link href="/search">
        <Button variant="ghost" size="sm" type="button">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>
      </Link>

      {/* Category Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">{category.name}</h1>
        <Badge variant="secondary">
          {books.length} book{books.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Books Grid */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Books in {category.name}</h2>
        {books.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {books.map((book) => {
              const rating = book.avgRating ?? 0;
              return (
                <Link key={book._id} href={`/books/${book._id}`}>
                  <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative aspect-2/3">
                      <Image
                        src={book.cover ?? "/logo.png"}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                    </div>
                    <CardContent className="space-y-1 p-3">
                      <h3 className="line-clamp-2 text-sm font-semibold">
                        {book.title}
                      </h3>
                      {rating > 0 && (
                        <div className="flex items-center gap-1">
                          <StarRating value={rating} readOnly size="sm" />
                          <span className="ml-1 text-xs text-muted-foreground">
                            {rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                      <Badge
                        variant={
                          book.status === "in-shelf" ? "default" : "destructive"
                        }
                        className="text-xs"
                      >
                        {book.status === "in-shelf"
                          ? "Available"
                          : "Out of Stock"}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No books found in this category yet.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

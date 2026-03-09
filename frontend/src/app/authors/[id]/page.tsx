import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchAuthorById, fetchBooksByAuthor } from "@/lib/api/server";
import { StarRating } from "@/components/shared/StarRating";

interface AuthorDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AuthorDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const author = await fetchAuthorById(id);
  if (!author) {
    return { title: "Author Not Found | Book Management Library" };
  }
  return {
    title: `${author.name} | Book Management Library`,
    description: author.bio ?? `Books by ${author.name}`,
  };
}

export default async function AuthorDetailPage({
  params,
}: AuthorDetailPageProps) {
  const { id } = await params;
  const [author, booksResponse] = await Promise.all([
    fetchAuthorById(id),
    fetchBooksByAuthor(id, { limit: 20 }).catch(() => null),
  ]);

  if (!author) {
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

      {/* Author Header */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-muted text-4xl font-bold">
          {author.name[0]}
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-2xl font-bold sm:text-3xl">{author.name}</h1>
          {author.bio && (
            <p className="max-w-2xl leading-relaxed text-muted-foreground">
              {author.bio}
            </p>
          )}
          <Badge variant="secondary">
            {books.length} book{books.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      {/* Books Grid */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Books by {author.name}</h2>
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
                      <div className="flex items-center gap-1">
                        <StarRating value={rating} readOnly size="sm" />
                        <span className="ml-1 text-xs text-muted-foreground">
                          {rating.toFixed(1)}
                        </span>
                      </div>
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
              No books found for this author.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

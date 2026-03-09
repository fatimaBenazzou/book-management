import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  fetchBookById,
  fetchBooksByAuthor,
  fetchRecommendations,
} from "@/lib/api/server";
import { getAuthorId, getAuthorName } from "@/lib/utils/format";
import BookDetailClient from "./BookDetailClient";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BookDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const book = await fetchBookById(id);
    return {
      title: `${book.title} | Book Management Library`,
      description:
        book.description ?? `${book.title} by ${getAuthorName(book.author)}`,
    };
  } catch {
    return { title: "Book Not Found | Book Management Library" };
  }
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;

  let book: BookI;
  try {
    book = await fetchBookById(id);
  } catch {
    notFound();
  }

  const cookieStore = await cookies();
  const isAuthenticated = !!cookieStore.get("auth_token")?.value;

  const authorId = getAuthorId(book.author);
  const [authorBooksResponse, recommendations] = await Promise.all([
    authorId
      ? fetchBooksByAuthor(authorId, { limit: 5 }).catch(() => null)
      : Promise.resolve(null),
    isAuthenticated
      ? fetchRecommendations(10).catch(() => [])
      : Promise.resolve([]),
  ]);

  const authorBooks = (authorBooksResponse?.data ?? []).filter(
    (b) => b._id !== id,
  );

  return (
    <BookDetailClient
      id={id}
      initialBook={book}
      initialAuthorBooks={authorBooks}
      recommendations={recommendations}
    />
  );
}

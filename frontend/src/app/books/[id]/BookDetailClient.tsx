"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  Loader2,
  Share2,
  Star,
  ShoppingCart,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useBook,
  useBooks,
  useAddBookRating,
  useBookRatings,
  useCreateBorrow,
  useMyBorrows,
  useIsFavorite,
  useToggleFavorite,
} from "@/lib/hooks";
import { formatCurrency, getAuthorName, getAuthorId } from "@/lib/utils/format";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { addToCart, selectIsInCart } from "@/lib/store/slices/cart";
import { SectionCarousel } from "@/components/features/home";
import { StarRating } from "@/components/shared/StarRating";

interface BookDetailClientProps {
  id: string;
  initialBook: BookI;
  initialAuthorBooks: BookI[];
  recommendations: BookI[];
}

export default function BookDetailClient({
  id,
  initialBook,
  initialAuthorBooks,
  recommendations,
}: BookDetailClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [userRating, setUserRating] = useState(0);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [minBorrowDate] = useState(
    () => new Date(Date.now() + 86_400_000).toISOString().split("T")[0],
  );

  const isFavorite = useIsFavorite(id);
  const toggleFavoriteMutation = useToggleFavorite();
  const isInCart = useAppSelector((state) => selectIsInCart(state, id));
  const { isLoggedIn, user } = useAppSelector((state) => state.user);

  const { data: fetchedBook } = useBook(id);
  const book = fetchedBook ?? initialBook;

  const { data: authorBooksResponse } = useBooks({
    author: book ? getAuthorId(book.author) : undefined,
    limit: 5,
  });

  const authorBooks =
    authorBooksResponse?.data?.filter((b) => b._id !== id) ??
    initialAuthorBooks;

  // Fetch existing ratings to pre-fill the user's rating
  const { data: bookRatings } = useBookRatings(id);
  const existingUserRating = bookRatings?.find((r) => {
    const ratedById = typeof r.ratedBy === "string" ? r.ratedBy : r.ratedBy._id;
    return ratedById === user?._id;
  });

  // Derive the displayed rating: user's new choice takes priority, then existing
  const displayedRating =
    userRating > 0 ? userRating : (existingUserRating?.rating ?? 0);

  const createBorrowMutation = useCreateBorrow();

  const { data: myBorrowsResponse } = useMyBorrows({});
  const hasPendingBorrow =
    isLoggedIn &&
    (myBorrowsResponse?.data ?? []).some(
      (b) =>
        (typeof b.book === "string" ? b.book : b.book?._id) === id &&
        (b.status === "pending" ||
          b.status === "approved" ||
          b.status === "active"),
    );

  const handleAddToCart = () => {
    if (!book) return;
    if (isInCart) {
      toast.info("This book is already in your cart");
    } else {
      dispatch(addToCart(book));
      toast.success("Book added to cart!");
    }
  };

  const handleBorrowBook = async () => {
    if (!dueDate) {
      toast.error("Please select a due date");
      return;
    }
    try {
      await createBorrowMutation.mutateAsync({ bookId: id, dueDate });
      toast.success("Borrow request sent. An admin will review it.");
      setBorrowDialogOpen(false);
      setDueDate("");
    } catch {
      toast.error("Failed to send borrow request");
    }
  };

  const handleBorrowClick = () => {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    setBorrowDialogOpen(true);
  };

  const ratingMutation = useAddBookRating();

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    toggleFavoriteMutation.mutate(id, {
      onSuccess: (result) => {
        toast.success(
          result.isFavorite ? "Added to favorites" : "Removed from favorites",
        );
      },
      onError: () => {
        toast.error("Failed to update favorites");
      },
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const authorName = book ? getAuthorName(book.author) : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: book?.title ?? "",
          text: `Check out "${book?.title}" by ${authorName}`,
          url,
        });
      } catch {
        // Sharing failed or was cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleRatingSubmit = async () => {
    if (displayedRating < 1 || displayedRating > 5) return;
    try {
      await ratingMutation.mutateAsync({
        bookId: id,
        data: { rating: displayedRating },
      });
      toast.success(
        existingUserRating
          ? "Rating updated!"
          : "Thank you for rating this book!",
      );
      setShowRatingForm(false);
    } catch {
      toast.error("Failed to submit rating");
    }
  };

  if (!book) return null;

  const authorName = getAuthorName(book.author);
  const rating = book.avgRating ?? 0;

  return (
    <div className="container mx-auto space-y-6 p-4">
      <Button variant="ghost" onClick={() => router.back()} type="button">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        {/* Left Column - Book Cover and Actions */}
        <div className="md:col-span-1 lg:col-span-3">
          <Card className="overflow-hidden py-1">
            <div className="relative aspect-2/3">
              <Image
                src={book.cover ?? "/logo.png"}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
            <CardContent className="space-y-2 p-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleShare}
                type="button"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowRatingForm(!showRatingForm)}
                type="button"
              >
                <Star className="mr-2 h-4 w-4" />
                {existingUserRating ? "Update Rating" : "Rate Book"}
              </Button>
              {showRatingForm && (
                <div className="space-y-2 rounded-lg bg-muted p-4">
                  <p className="text-sm font-semibold">Your Rating:</p>
                  <StarRating
                    value={displayedRating}
                    onChange={setUserRating}
                    size="lg"
                  />
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={handleRatingSubmit}
                    disabled={displayedRating === 0 || ratingMutation.isPending}
                    type="button"
                  >
                    {ratingMutation.isPending
                      ? "Submitting..."
                      : "Submit Rating"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Book Details */}
        <div className="md:col-span-1 lg:col-span-6">
          <Card>
            <CardContent className="space-y-4 p-6">
              <h1 className="text-2xl font-bold sm:text-3xl">{book.title}</h1>
              <p className="text-lg text-muted-foreground">
                by:{" "}
                <Link
                  href={`/authors/${getAuthorId(book.author) ?? ""}`}
                  className="font-semibold hover:text-primary hover:underline"
                >
                  {authorName}
                </Link>
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <StarRating value={rating} readOnly />
                <span className="text-lg font-semibold">
                  {rating.toFixed(1)}
                </span>
                {book.ratingCount ? (
                  <span className="text-sm text-muted-foreground">
                    ({book.ratingCount} ratings)
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    (No ratings yet)
                  </span>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    book.status === "in-shelf" ? "default" : "destructive"
                  }
                >
                  {book.status === "in-shelf" ? "Available" : "Out of Stock"}
                </Badge>
                {book.availableStock !== undefined && (
                  <span className="text-sm text-muted-foreground">
                    {book.availableStock} copies available
                  </span>
                )}
              </div>

              <hr className="my-4" />

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(book.price?.current ?? 0)}
                </span>
                {book.price?.original &&
                  book.price.original > (book.price?.current ?? 0) && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatCurrency(book.price.original)}
                    </span>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  className="flex-1"
                  variant={isInCart ? "outline" : "default"}
                  onClick={handleAddToCart}
                  disabled={book.status !== "in-shelf"}
                  type="button"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isInCart ? "In Cart" : "Add to Cart"}
                </Button>
                <Button
                  disabled={
                    book.status !== "in-shelf" ||
                    hasPendingBorrow ||
                    createBorrowMutation.isPending
                  }
                  type="button"
                  onClick={handleBorrowClick}
                >
                  {createBorrowMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BookOpen className="mr-2 h-4 w-4" />
                  )}
                  {hasPendingBorrow ? "Request Pending" : "Borrow Book"}
                </Button>
                <Dialog
                  open={borrowDialogOpen}
                  onOpenChange={setBorrowDialogOpen}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Borrow &quot;{book.title}&quot;</DialogTitle>
                      <DialogDescription>
                        Select a return date for your borrow request. An admin
                        will review it.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-4">
                      <Label htmlFor="dueDate">Return by *</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        min={minBorrowDate}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setBorrowDialogOpen(false)}
                        type="button"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleBorrowBook}
                        disabled={!dueDate || createBorrowMutation.isPending}
                        type="button"
                      >
                        {createBorrowMutation.isPending
                          ? "Sending..."
                          : "Submit Request"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  size="icon"
                  onClick={handleToggleFavorite}
                  type="button"
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                  />
                </Button>
              </div>

              <hr className="my-4" />

              {/* Description */}
              <div>
                <h3 className="mb-2 text-xl font-semibold">Description</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {book.description ?? "No description available."}
                </p>
              </div>

              {/* Keywords */}
              {book.keywords && book.keywords.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {book.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Category */}
              {book.category && (
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Category</h3>
                  <Badge variant="default" className="text-sm">
                    {typeof book.category === "string"
                      ? book.category
                      : (book.category.name ?? "Unknown")}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Author Info */}
        <div className="md:col-span-2 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>About the Author</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link
                href={`/authors/${getAuthorId(book.author) ?? ""}`}
                className="block"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-semibold">
                  {authorName[0]}
                </div>
                <h3 className="mt-2 text-lg font-semibold hover:text-primary">
                  {authorName}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">
                Renowned author with multiple published works.
              </p>

              <hr />

              <h3 className="font-semibold">Other Books by this Author</h3>
              {authorBooks.length > 0 ? (
                <div className="space-y-2">
                  {authorBooks.slice(0, 3).map((authorBook) => (
                    <Link
                      key={authorBook._id}
                      href={`/books/${authorBook._id}`}
                      className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-muted"
                    >
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded">
                        <Image
                          src={authorBook.cover ?? "/logo.png"}
                          alt={authorBook.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold">
                          {authorBook.title}
                        </p>
                        <StarRating
                          value={authorBook.avgRating ?? 0}
                          readOnly
                          size="sm"
                        />
                      </div>
                    </Link>
                  ))}
                  {authorBooks.length > 3 && (
                    <Link href={`/authors/${getAuthorId(book.author) ?? ""}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        type="button"
                      >
                        View All
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No other books available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <SectionCarousel
          title="You Might Also Like"
          books={recommendations}
          showAllHref="/search"
        />
      )}
    </div>
  );
}

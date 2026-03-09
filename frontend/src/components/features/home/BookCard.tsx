"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/lib/store";
import { useIsFavorite, useToggleFavorite } from "@/lib/hooks";
import { getAuthorName } from "@/lib/utils/format";
import { StarRating } from "@/components/shared/StarRating";
import { toast } from "sonner";
import type { MouseEvent } from "react";

interface BookCardProps {
  /** The book data to display */
  book: BookI;
  /** Display mode: normal (cover only), details (with info), expanded (with borrow data) */
  mode?: "normal" | "details" | "expanded";
  /** Additional CSS classes */
  className?: string;
  /** Borrow data for expanded mode */
  borrowData?: {
    createdAt: string;
    dueDate: string;
    status:
      | "pending"
      | "approved"
      | "rejected"
      | "active"
      | "overdue"
      | "returned";
  };
  /** Callback for return action */
  onReturn?: () => void;
  /** Callback for cancel action */
  onCancel?: () => void;
}

/**
 * BookCard component - displays a book in various formats
 */
export function BookCard({
  book,
  mode = "normal",
  className = "",
  borrowData,
  onReturn,
  onCancel,
}: BookCardProps) {
  const router = useRouter();
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const isFavorite = useIsFavorite(book._id);
  const toggleFavoriteMutation = useToggleFavorite();

  const handleFavoriteClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    toggleFavoriteMutation.mutate(book._id, {
      onError: () => toast.error("Failed to update favorites"),
    });
  };

  const getStatusBadge = () => {
    if (!borrowData) return null;
    const statusVariants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      active: "default",
      overdue: "destructive",
      returned: "outline",
    };
    return (
      <Badge variant={statusVariants[borrowData.status] ?? "outline"}>
        {borrowData.status.charAt(0).toUpperCase() + borrowData.status.slice(1)}
      </Badge>
    );
  };

  const renderRating = (rating: number) => (
    <StarRating value={rating} readOnly size="sm" />
  );

  return (
    <Card
      className={`flex h-64 w-40 flex-row p-3 shadow-lg transition-shadow hover:shadow-xl ${className}`}
    >
      <CardContent className="flex flex-col p-0">
        <Link
          href={`/books/${book._id}`}
          className={`relative w-full shrink-0 overflow-hidden rounded-md ${mode === "normal" ? "h-full" : "h-40"}`}
        >
          <Image
            src={book.cover ?? "/logo.png"}
            alt={book.title}
            fill
            className="object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-8 w-8"
            onClick={handleFavoriteClick}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            type="button"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite
                  ? "fill-primary text-primary"
                  : "text-muted-foreground"
              }`}
            />
          </Button>
        </Link>

        {mode === "details" && (
          <Link href={`/books/${book._id}`} className="mt-2 flex-1">
            <h3 className="line-clamp-2 text-sm font-semibold">{book.title}</h3>
            <p className="text-xs text-muted-foreground">
              {getAuthorName(book.author)}
            </p>
            {book.avgRating !== undefined && (
              <div className="mt-2">{renderRating(book.avgRating)}</div>
            )}
          </Link>
        )}
      </CardContent>

      {mode === "expanded" && borrowData && (
        <div className="flex flex-col items-end justify-between gap-2">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Borrow Date</p>
            <p className="text-sm font-semibold">
              {new Date(borrowData.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Due Date</p>
            <p className="text-sm font-semibold">
              {new Date(borrowData.dueDate).toLocaleDateString()}
            </p>
          </div>
          {getStatusBadge()}
          {borrowData.status === "active" && onReturn && (
            <Button size="sm" onClick={onReturn} type="button">
              Return Book
            </Button>
          )}
          {borrowData.status === "pending" && onCancel && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onCancel}
              type="button"
            >
              Cancel Request
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/lib/store";
import { useIsFavorite, useToggleFavorite } from "@/lib/hooks";
import { getAuthorName } from "@/lib/utils/format";
import { StarRating } from "@/components/shared/StarRating";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

function getCategoryName(
  category: string | { _id: string; name: string } | undefined,
): string {
  if (!category) return "Unknown";
  return typeof category === "string" ? category : category.name;
}

export function BookRow({ book }: { book: BookI }) {
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

  const rating = book.avgRating ?? 0;

  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      <td className="p-4">
        <Link href={`/books/${book._id}`} className="flex items-center gap-3">
          <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded">
            <Image
              src={book.cover ?? "/logo.png"}
              alt={book.title}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div>
            <div className="font-semibold">{book.title}</div>
            <div className="text-sm text-muted-foreground">
              by {getAuthorName(book.author)}
            </div>
          </div>
        </Link>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-1">
          <StarRating value={rating} readOnly size="sm" />
          <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
          {book.ratingCount !== undefined && (
            <span className="text-sm text-muted-foreground">
              ({book.ratingCount})
            </span>
          )}
        </div>
      </td>
      <td className="p-4">
        <Badge variant="secondary">{getCategoryName(book.category)}</Badge>
      </td>
      <td className="p-4">
        <Badge variant={book.status === "in-shelf" ? "default" : "destructive"}>
          {book.status === "in-shelf" ? "Available" : "Out of Stock"}
        </Badge>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            type="button"
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}`}
            />
          </Button>
          <Link href={`/books/${book._id}`}>
            <Button variant="outline" size="sm" type="button">
              Preview
            </Button>
          </Link>
        </div>
      </td>
    </tr>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useAppSelector } from "@/lib/store";
import { useIsFavorite, useToggleFavorite } from "@/lib/hooks";
import { getAuthorName } from "@/lib/utils/format";
import { StarRating } from "@/components/shared/StarRating";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

function SectionBookCard({ book }: { book: BookI }) {
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
    <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/books/${book._id}`}>
        <div className="relative aspect-2/3">
          <Image
            src={book.cover ?? "/logo.png"}
            alt={book.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-8 w-8 bg-background/60 backdrop-blur-sm"
            onClick={handleFavoriteClick}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            type="button"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite
                  ? "fill-primary text-primary"
                  : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>
      </Link>
      <CardContent className="space-y-1 p-3">
        <Link href={`/books/${book._id}`}>
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight hover:text-primary">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground">
          {getAuthorName(book.author)}
        </p>
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <StarRating value={rating} readOnly size="sm" />
            <span className="ml-0.5 text-xs text-muted-foreground">
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type SectionCarouselProps = {
  title: string;
  books: BookI[];
  showAllHref: string;
};

export function SectionCarousel({
  title,
  books,
  showAllHref,
}: SectionCarouselProps) {
  if (books.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Link href={showAllHref}>
          <Button variant="ghost" className="gap-1" type="button">
            Show all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-4">
          {books.map((book) => (
            <CarouselItem
              key={book._id}
              className="basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <SectionBookCard book={book} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 hidden md:flex" />
        <CarouselNext className="-right-4 hidden md:flex" />
      </Carousel>
    </section>
  );
}

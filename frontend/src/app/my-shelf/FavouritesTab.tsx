import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FavoriteBookCard } from "./FavoriteBookCard";

interface FavouritesTabProps {
  favorites: BookI[];
  isLoading: boolean;
}

export function FavouritesTab({ favorites, isLoading }: FavouritesTabProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-xl" />
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 border-dashed p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Heart className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium text-muted-foreground">
          No favourite books yet. Start adding some!
        </p>
        <Link href="/search">
          <Button className="mt-2 gap-2" type="button">
            <Search className="h-4 w-4" />
            Browse Books
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {favorites.map((book: BookI) => (
        <FavoriteBookCard key={book._id} book={book} />
      ))}
    </div>
  );
}

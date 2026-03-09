import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthorName } from "@/lib/utils/format";

export function FavoriteBookCard({ book }: { book: BookI }) {
  return (
    <Link href={`/books/${book._id}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-3/4">
          <Image
            src={book.cover ?? "/logo.png"}
            alt={book.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-2 font-semibold">{book.title}</h3>
          <p className="text-sm text-muted-foreground">
            {getAuthorName(book.author)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

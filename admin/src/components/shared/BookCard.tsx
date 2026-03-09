import React from "react";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { BookCardContent } from "./BookCardContent";
import type { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
  showActions?: boolean;
  actions?: React.ReactNode;
}

export function BookCard({
  book,
  onClick,
  showActions = false,
  actions,
}: BookCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-lg ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      <div className="flex">
        <div className="w-24 h-32 shrink-0 bg-muted flex items-center justify-center">
          {book.cover ? (
            <img
              src={book.cover}
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <BookCardContent
          book={book}
          showActions={showActions}
          actions={actions}
        />
      </div>
    </Card>
  );
}

export default BookCard;

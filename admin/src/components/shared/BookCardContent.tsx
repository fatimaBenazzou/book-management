import React from "react";
import { Link } from "react-router";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency } from "@/lib/utils";
import type { Book } from "@/types/book";
import type { Author } from "@/types/author";
import type { Category } from "@/types/category";
import { getAuthorName, getAuthorId, getCategoryName } from "./bookCardUtils";

interface BookCardContentProps {
  book: Book;
  showActions?: boolean;
  actions?: React.ReactNode;
}

export function BookCardContent({
  book,
  showActions = false,
  actions,
}: BookCardContentProps) {
  return (
    <CardContent className="flex-1 p-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
          <p className="text-sm text-muted-foreground">
            by{" "}
            {getAuthorId(book.author as Author) ? (
              <Link
                to={`/authors/${getAuthorId(book.author as Author)}`}
                className="hover:text-primary hover:underline transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {getAuthorName(book.author as Author)}
              </Link>
            ) : (
              getAuthorName(book.author as Author)
            )}
          </p>
        </div>
        <StatusBadge status={book.status} type="book" />
      </div>

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="text-xs">
          {getCategoryName(book.category as Category)}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {book.serialNumber}
        </Badge>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <div className="space-y-0.5">
          <p className="text-lg font-bold">
            {formatCurrency(book.price.current)}
          </p>
          {book.price.original && book.price.original > book.price.current && (
            <p className="text-xs text-muted-foreground line-through">
              {formatCurrency(book.price.original)}
            </p>
          )}
        </div>
        <div className="text-right text-sm">
          <p className="text-muted-foreground">Stock</p>
          <p className="font-medium">
            {book.availableStock}/{book.totalStock}
          </p>
        </div>
      </div>

      {showActions && actions && (
        <div className="mt-3 pt-3 border-t">{actions}</div>
      )}
    </CardContent>
  );
}

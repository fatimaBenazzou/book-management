import Link from "next/link";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getAuthorName } from "@/lib/utils/format";

function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-600",
  approved: "bg-blue-500/20 text-blue-600",
  active: "bg-green-500/20 text-green-600",
  returned: "bg-gray-500/20 text-gray-600",
  rejected: "bg-red-500/20 text-red-600",
};

interface BorrowCardProps {
  borrow: BorrowI;
  onReturn?: () => void;
  onCancel?: () => void;
}

export function BorrowCard({ borrow, onReturn, onCancel }: BorrowCardProps) {
  const book = typeof borrow.book !== "string" ? borrow.book : null;
  if (!book) return null;

  const overdue = borrow.status === "active" && isOverdue(borrow.dueDate);

  return (
    <Card className={`overflow-hidden ${overdue ? "border-red-500/50" : ""}`}>
      <CardContent className="flex gap-4 p-4">
        <Link
          href={`/books/${book._id}`}
          className="relative h-32 w-24 shrink-0 overflow-hidden rounded"
        >
          <Image
            src={book.cover ?? "/logo.png"}
            alt={book.title}
            fill
            className="object-cover"
            sizes="96px"
          />
        </Link>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <Link
              href={`/books/${book._id}`}
              className="text-lg font-semibold hover:text-primary"
            >
              {book.title}
            </Link>
            <p className="text-sm text-muted-foreground">
              {getAuthorName(book.author)}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <Badge
                className={
                  overdue
                    ? "bg-red-500/20 text-red-600"
                    : (statusColors[borrow.status ?? "pending"] ??
                      statusColors.pending)
                }
              >
                {overdue ? "Overdue" : borrow.status}
              </Badge>
              {overdue && (
                <span className="flex items-center gap-1 text-xs text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  Past due date
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>Borrowed: {formatDate(borrow.createdAt)}</span>
            {borrow.dueDate && (
              <span className={overdue ? "font-medium text-red-600" : ""}>
                Due: {formatDate(borrow.dueDate)}
              </span>
            )}
            {borrow.returnedAt && (
              <span>Returned: {formatDate(borrow.returnedAt)}</span>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            {onReturn && borrow.status === "active" && (
              <Button size="sm" onClick={onReturn} type="button">
                Return Book
              </Button>
            )}
            {onCancel && borrow.status === "pending" && (
              <Button
                size="sm"
                variant="outline"
                onClick={onCancel}
                type="button"
              >
                Cancel Request
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

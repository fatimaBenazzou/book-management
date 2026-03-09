import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BorrowCard } from "./BorrowCard";
import type { ReactNode } from "react";

interface BorrowListProps {
  borrows: BorrowI[];
  isLoading: boolean;
  emptyIcon: ReactNode;
  emptyMessage: string;
  showReturn: boolean;
  showCancel: boolean;
  onReturn: (id: string) => void;
  onCancel: (id: string) => void;
}

export function BorrowList({
  borrows,
  isLoading,
  emptyIcon,
  emptyMessage,
  showReturn,
  showCancel,
  onReturn,
  onCancel,
}: BorrowListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  if (borrows.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 border-dashed p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          {emptyIcon}
        </div>
        <p className="text-lg font-medium text-muted-foreground">
          {emptyMessage}
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
    <div className="space-y-4">
      {borrows.map((borrow) => (
        <BorrowCard
          key={borrow._id}
          borrow={borrow}
          onReturn={showReturn ? () => onReturn(borrow._id) : undefined}
          onCancel={
            showCancel && borrow.status === "pending"
              ? () => onCancel(borrow._id)
              : undefined
          }
        />
      ))}
    </div>
  );
}

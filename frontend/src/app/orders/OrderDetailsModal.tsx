"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { getStatusColor } from "./orderConstants";

interface OrderDetailsModalProps {
  selectedOrderId: string | null;
  orderDetails: OrderI | undefined;
  isLoading: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({
  selectedOrderId,
  orderDetails,
  isLoading,
  onClose,
}: OrderDetailsModalProps) {
  return (
    <Dialog open={!!selectedOrderId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Order Details {selectedOrderId && `#${selectedOrderId.slice(-8)}`}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : orderDetails ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge
                className={getStatusColor(orderDetails.status ?? "pending")}
              >
                {orderDetails.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDate(orderDetails.createdAt)}
              </span>
            </div>

            <hr />

            <div className="space-y-2">
              <h4 className="font-semibold">Items</h4>
              {orderDetails.books?.map((item: OrderBookItem, index: number) => {
                const book =
                  typeof item.bookId === "object" ? item.bookId : null;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg bg-muted p-3"
                  >
                    {book?.cover && (
                      <div className="relative h-16 w-12 overflow-hidden rounded">
                        <Image
                          src={book.cover}
                          alt={book.title ?? "Book"}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.title ?? "Unknown Book"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × {formatCurrency(item.price ?? 0)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency((item.price ?? 0) * (item.quantity ?? 1))}
                    </p>
                  </div>
                );
              })}
            </div>

            <hr />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">
                {formatCurrency(orderDetails.totalPrice ?? 0)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Failed to load order details
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

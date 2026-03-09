"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/format";

interface CartItemProps {
  item: {
    bookId: string;
    title: string;
    price: number;
    cover?: string;
    quantity: number;
  };
  onRemove: (bookId: string) => void;
}

export function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-md p-2 hover:bg-muted">
      <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded">
        <Image
          src={item.cover ?? "/logo.png"}
          alt={item.title}
          fill
          className="object-cover"
          sizes="36px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.title}</p>
        <p className="text-xs text-muted-foreground">
          {formatCurrency(item.price)}
          {item.quantity > 1 && ` × ${item.quantity}`}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0"
        onClick={() => onRemove(item.bookId)}
        aria-label={`Remove ${item.title} from cart`}
        type="button"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

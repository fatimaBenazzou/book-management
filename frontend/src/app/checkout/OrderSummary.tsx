import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";

interface CartItem {
  bookId: string;
  title: string;
  price: number;
  cover?: string;
  quantity: number;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  isPending: boolean;
  onSubmit: () => void;
}

export function OrderSummary({
  cartItems,
  subtotal,
  shippingFee,
  total,
  isPending,
  onSubmit,
}: OrderSummaryProps) {
  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-64 space-y-3 overflow-y-auto">
          {cartItems.map((item) => (
            <div
              key={item.bookId}
              className="flex items-center gap-3 rounded-lg bg-muted p-2"
            >
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
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <hr />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>
              {shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}
            </span>
          </div>
        </div>

        <hr />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>

        <Button
          type="button"
          className="hidden w-full lg:inline-flex"
          size="lg"
          onClick={onSubmit}
          disabled={isPending}
        >
          {isPending ? "Placing Order..." : "Place Order"}
        </Button>

        <Link href="/search" className="block">
          <Button variant="outline" className="w-full" type="button">
            Back to Shopping
          </Button>
        </Link>

        <p className="text-center text-xs text-muted-foreground">
          By placing your order, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </CardContent>
    </Card>
  );
}

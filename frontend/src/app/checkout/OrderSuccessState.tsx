import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OrderSuccessStateProps {
  orderId: string | null;
}

export function OrderSuccessState({ orderId }: OrderSuccessStateProps) {
  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card className="text-center">
        <CardContent className="py-12">
          <CheckCircle className="mx-auto mb-4 h-24 w-24 text-green-500" />
          <h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
          <p className="mt-2 text-muted-foreground">
            Thank you for your order. You will receive a confirmation email
            shortly.
          </p>
          {orderId && (
            <p className="mt-4 font-mono text-sm">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link href="/orders">
              <Button type="button">View My Orders</Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" type="button">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

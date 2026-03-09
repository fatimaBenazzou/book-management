import Link from "next/link";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyCartState() {
  return (
    <div className="container mx-auto p-4">
      <Card className="text-center">
        <CardContent className="py-12">
          <Store className="mx-auto mb-4 h-24 w-24 text-muted-foreground/30" />
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">
            Add some books to your cart before checking out
          </p>
          <Link href="/search">
            <Button className="mt-4" type="button">
              Browse Books
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

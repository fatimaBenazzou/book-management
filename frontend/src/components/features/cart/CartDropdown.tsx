"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { removeFromCart, clearCart } from "@/lib/store/slices/cart";
import { formatCurrency } from "@/lib/utils/format";
import { toast } from "sonner";
import { CartItem } from "./CartItem";

export function CartDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const { isLoggedIn } = useAppSelector((state) => state.user);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleRemove = (bookId: string) => {
    dispatch(removeFromCart(bookId));
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared");
  };

  const handleCheckout = () => {
    setOpen(false);
    if (!isLoggedIn) {
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      toast.info("Please log in to complete your purchase");
      router.push("/auth/login");
      return;
    }
    router.push("/checkout");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          type="button"
          aria-label="Shopping cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {itemCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {items.length === 0 ? (
          <div className="p-6 text-center">
            <ShoppingCart className="mx-auto mb-2 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium">Your cart is empty</p>
            <p className="text-xs text-muted-foreground">
              Add some books to get started
            </p>
          </div>
        ) : (
          <>
            <div className="px-4 py-3">
              <p className="text-sm font-semibold">
                Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
              </p>
            </div>
            <Separator />
            <ScrollArea className="max-h-64">
              <div className="space-y-1 p-2">
                {items.map((item) => (
                  <CartItem
                    key={item.bookId}
                    item={item}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-sm font-bold text-primary">
                  {formatCurrency(total)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleClearCart}
                  type="button"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Clear Cart
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleCheckout}
                  type="button"
                >
                  Go to Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

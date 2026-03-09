"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useStore } from "@tanstack/react-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import { clearCart } from "@/lib/store/slices/cart";
import { useCreateOrder } from "@/lib/hooks/useOrders";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { checkoutFormSchema } from "./checkoutSchema";
import { CheckoutForm, type OrderNotesField } from "./CheckoutForm";
import type { ShippingFields } from "./ShippingAddressCard";
import { OrderSummary } from "./OrderSummary";
import { EmptyCartState } from "./EmptyCartState";
import { OrderSuccessState } from "./OrderSuccessState";

export default function CheckoutClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { user } = useAppSelector((state) => state.user);

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const createOrderMutation = useCreateOrder();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const form = useForm({
    defaultValues: {
      deliveryMethod: "delivery" as "pickup" | "delivery",
      fullName: user
        ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
        : "",
      phone: user?.phone ?? "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      instructions: "",
      orderNotes: "",
    },
    onSubmit: async ({ value }) => {
      if (cartItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      const orderData: CreateOrderData = {
        books: cartItems.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
        })),
        deliveryMethod: value.deliveryMethod,
        orderNotes: value.orderNotes || undefined,
        ...(value.deliveryMethod === "delivery" && {
          shippingAddress: {
            fullName: value.fullName,
            street: value.street,
            city: value.city,
            state: value.state || undefined,
            postalCode: value.postalCode,
            country: value.country,
            phone: value.phone,
            instructions: value.instructions || undefined,
          },
        }),
      };

      try {
        const result = await createOrderMutation.mutateAsync(orderData);
        dispatch(clearCart());
        setOrderId(result._id);
        setOrderSuccess(true);
        toast.success("Order placed successfully!");
      } catch {
        toast.error("Failed to place order. Please try again.");
      }
    },
    validators: {
      onSubmit: checkoutFormSchema,
    },
  });

  const formValues = useStore(form.store, (s) => s.values);
  const formMeta = useStore(form.store, (s) => s.fieldMeta);
  const deliveryMethod = formValues.deliveryMethod;
  const shippingFee = deliveryMethod === "delivery" && subtotal < 50 ? 5.0 : 0;
  const total = subtotal + shippingFee;

  const shippingFields: ShippingFields = {
    fullName: {
      value: formValues.fullName,
      onChange: (v) => form.setFieldValue("fullName", v),
      onBlur: () => {
        void form.validateField("fullName", "blur");
      },
      errors: formMeta.fullName?.errors ?? [],
    },
    phone: {
      value: formValues.phone,
      onChange: (v) => form.setFieldValue("phone", v),
      onBlur: () => {
        void form.validateField("phone", "blur");
      },
      errors: formMeta.phone?.errors ?? [],
    },
    street: {
      value: formValues.street,
      onChange: (v) => form.setFieldValue("street", v),
      onBlur: () => {
        void form.validateField("street", "blur");
      },
      errors: formMeta.street?.errors ?? [],
    },
    city: {
      value: formValues.city,
      onChange: (v) => form.setFieldValue("city", v),
      onBlur: () => {
        void form.validateField("city", "blur");
      },
      errors: formMeta.city?.errors ?? [],
    },
    state: {
      value: formValues.state,
      onChange: (v) => form.setFieldValue("state", v),
      onBlur: () => {
        void form.validateField("state", "blur");
      },
      errors: formMeta.state?.errors ?? [],
    },
    postalCode: {
      value: formValues.postalCode,
      onChange: (v) => form.setFieldValue("postalCode", v),
      onBlur: () => {
        void form.validateField("postalCode", "blur");
      },
      errors: formMeta.postalCode?.errors ?? [],
    },
    country: {
      value: formValues.country,
      onChange: (v) => form.setFieldValue("country", v),
      onBlur: () => {
        void form.validateField("country", "blur");
      },
      errors: formMeta.country?.errors ?? [],
    },
    instructions: {
      value: formValues.instructions,
      onChange: (v) => form.setFieldValue("instructions", v),
      onBlur: () => {
        void form.validateField("instructions", "blur");
      },
      errors: formMeta.instructions?.errors ?? [],
    },
  };

  const orderNotes: OrderNotesField = {
    value: formValues.orderNotes,
    onChange: (v) => form.setFieldValue("orderNotes", v),
    onBlur: () => {
      void form.validateField("orderNotes", "blur");
    },
    errors: formMeta.orderNotes?.errors ?? [],
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <AuthGuard>
        <EmptyCartState />
      </AuthGuard>
    );
  }

  if (orderSuccess) {
    return (
      <AuthGuard>
        <OrderSuccessState orderId={orderId} />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto space-y-6 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
            <p className="text-muted-foreground">Complete your order</p>
          </div>
          <Link href="/search">
            <Button variant="ghost" type="button">
              Back to Shopping
            </Button>
          </Link>
        </div>

        <div className="flex flex-col-reverse gap-6 lg:flex-row">
          <div className="space-y-6 lg:w-3/5">
            <CheckoutForm
              onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit();
              }}
              deliveryMethod={deliveryMethod}
              onDeliveryMethodChange={(v) =>
                form.setFieldValue("deliveryMethod", v)
              }
              shippingFields={shippingFields}
              orderNotes={orderNotes}
              isPending={createOrderMutation.isPending}
            />
          </div>
          <div className="lg:w-2/5">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              isPending={createOrderMutation.isPending}
              onSubmit={() => form.handleSubmit()}
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

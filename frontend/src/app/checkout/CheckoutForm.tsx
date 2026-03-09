"use client";

import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "./FieldError";
import {
  ShippingAddressCard,
  type ShippingFields,
} from "./ShippingAddressCard";
import { DeliveryMethodCard } from "./DeliveryMethodCard";

export type CheckoutFormValues = {
  deliveryMethod: "pickup" | "delivery";
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  instructions: string;
  orderNotes: string;
};

export type OrderNotesField = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  errors: Array<string | { message: string } | undefined>;
};

interface CheckoutFormProps {
  onSubmit: (e: React.FormEvent) => void;
  deliveryMethod: "pickup" | "delivery";
  onDeliveryMethodChange: (value: "pickup" | "delivery") => void;
  shippingFields: ShippingFields;
  orderNotes: OrderNotesField;
  isPending: boolean;
}

export function CheckoutForm({
  onSubmit,
  deliveryMethod,
  onDeliveryMethodChange,
  shippingFields,
  orderNotes,
  isPending,
}: CheckoutFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <DeliveryMethodCard
        value={deliveryMethod}
        onChange={onDeliveryMethodChange}
      />
      {deliveryMethod === "delivery" && (
        <ShippingAddressCard fields={shippingFields} />
      )}
      <PaymentMethodCard />
      <OrderNotesCard orderNotes={orderNotes} />
      <Button
        type="submit"
        className="w-full lg:hidden"
        size="lg"
        disabled={isPending}
      >
        {isPending ? "Placing Order..." : "Place Order"}
      </Button>
    </form>
  );
}

function PaymentMethodCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-4">
          <div>
            <p className="font-medium">Cash on Delivery</p>
            <p className="text-sm text-muted-foreground">
              Pay when your order arrives or at pickup
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderNotesCard({ orderNotes }: { orderNotes: OrderNotesField }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Notes (Optional)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Textarea
            value={orderNotes.value}
            onBlur={orderNotes.onBlur}
            onChange={(e) => orderNotes.onChange(e.target.value)}
            placeholder="Add any special instructions or notes for your order..."
            rows={3}
          />
          <FieldError errors={orderNotes.errors} />
        </div>
      </CardContent>
    </Card>
  );
}

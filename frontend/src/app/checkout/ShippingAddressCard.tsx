import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";
import { FieldError } from "./FieldError";

export type ShippingField = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  errors: Array<string | { message: string } | undefined>;
};

export type ShippingFields = {
  fullName: ShippingField;
  phone: ShippingField;
  street: ShippingField;
  city: ShippingField;
  state: ShippingField;
  postalCode: ShippingField;
  country: ShippingField;
  instructions: ShippingField;
};

interface ShippingAddressCardProps {
  fields: ShippingFields;
}

export function ShippingAddressCard({ fields }: ShippingAddressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Address
        </CardTitle>
        <CardDescription>Enter your delivery address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fields.fullName.value}
              onBlur={fields.fullName.onBlur}
              onChange={(e) => fields.fullName.onChange(e.target.value)}
              placeholder="John Doe"
            />
            <FieldError errors={fields.fullName.errors} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={fields.phone.value}
              onBlur={fields.phone.onBlur}
              onChange={(e) => fields.phone.onChange(e.target.value)}
              placeholder="+1 234 567 890"
            />
            <FieldError errors={fields.phone.errors} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="street">Street Address *</Label>
          <Input
            id="street"
            value={fields.street.value}
            onBlur={fields.street.onBlur}
            onChange={(e) => fields.street.onChange(e.target.value)}
            placeholder="123 Main Street, Apt 4B"
          />
          <FieldError errors={fields.street.errors} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={fields.city.value}
              onBlur={fields.city.onBlur}
              onChange={(e) => fields.city.onChange(e.target.value)}
              placeholder="New York"
            />
            <FieldError errors={fields.city.errors} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              value={fields.state.value}
              onBlur={fields.state.onBlur}
              onChange={(e) => fields.state.onChange(e.target.value)}
              placeholder="NY"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              value={fields.postalCode.value}
              onBlur={fields.postalCode.onBlur}
              onChange={(e) => fields.postalCode.onChange(e.target.value)}
              placeholder="10001"
            />
            <FieldError errors={fields.postalCode.errors} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            value={fields.country.value}
            onBlur={fields.country.onBlur}
            onChange={(e) => fields.country.onChange(e.target.value)}
            placeholder="United States"
          />
          <FieldError errors={fields.country.errors} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
          <Textarea
            id="instructions"
            value={fields.instructions.value}
            onBlur={fields.instructions.onBlur}
            onChange={(e) => fields.instructions.onChange(e.target.value)}
            placeholder="Leave at door, ring doorbell, etc."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
}

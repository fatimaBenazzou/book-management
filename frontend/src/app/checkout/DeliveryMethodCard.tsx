import { Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/lib/utils/format";
interface DeliveryMethodCardProps {
  value: "pickup" | "delivery";
  onChange: (value: "pickup" | "delivery") => void;
}

export function DeliveryMethodCard({
  value,
  onChange,
}: DeliveryMethodCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Delivery Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={value}
          onValueChange={(v: string) => onChange(v as "pickup" | "delivery")}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <label
            htmlFor="delivery"
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
              value === "delivery"
                ? "border-primary bg-primary/5"
                : "hover:bg-muted"
            }`}
          >
            <RadioGroupItem value="delivery" id="delivery" />
            <div>
              <p className="font-medium">Home Delivery</p>
              <p className="text-sm text-muted-foreground">
                +{formatCurrency(5)} shipping (free over {formatCurrency(50)})
              </p>
            </div>
          </label>
          <label
            htmlFor="pickup"
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
              value === "pickup"
                ? "border-primary bg-primary/5"
                : "hover:bg-muted"
            }`}
          >
            <RadioGroupItem value="pickup" id="pickup" />
            <div>
              <p className="font-medium">Store Pickup</p>
              <p className="text-sm text-muted-foreground">Free</p>
            </div>
          </label>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

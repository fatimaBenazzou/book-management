"use client";

import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { getStatusColor } from "./orderConstants";

interface OrderCardProps {
  order: OrderI;
  onViewDetails: (id: string) => void;
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="font-semibold">Order #{order._id.slice(-8)}</h3>
              <Badge className={getStatusColor(order.status ?? "pending")}>
                {order.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
            </p>
            <p className="mt-2 text-lg font-bold text-primary">
              {formatCurrency(order.totalPrice ?? 0)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(order._id)}
            >
              <Eye className="mr-1 h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

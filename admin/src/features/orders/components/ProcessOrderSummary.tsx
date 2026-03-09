import { formatDate, formatCurrency, getDisplayName } from "@/lib/utils";
import type { Order } from "@/types/order";
import type { User } from "@/types/user";

interface ProcessOrderSummaryProps {
  order: Order;
}

export function ProcessOrderSummary({ order }: ProcessOrderSummaryProps) {
  const userName = getDisplayName(order.userId as string | User);

  return (
    <div className="space-y-2 text-sm border-b pb-4 mb-4">
      <p>
        <span className="text-muted-foreground">Order ID:</span>{" "}
        <span className="font-mono text-xs">{order._id}</span>
      </p>
      <p>
        <span className="text-muted-foreground">User:</span>{" "}
        <span className="font-medium">{userName}</span>
      </p>
      <p>
        <span className="text-muted-foreground">Items:</span>{" "}
        {order.books.length} book(s)
      </p>
      <p>
        <span className="text-muted-foreground">Total:</span>{" "}
        <span className="font-semibold">
          {formatCurrency(order.totalPrice)}
        </span>
      </p>
      <p>
        <span className="text-muted-foreground">Delivery Method:</span>{" "}
        <span className="capitalize">{order.deliveryMethod}</span>
      </p>
      <p>
        <span className="text-muted-foreground">Order Date:</span>{" "}
        {formatDate(order.createdAt)}
      </p>
    </div>
  );
}

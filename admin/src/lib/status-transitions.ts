import type { OrderStatus } from "@/types/order";
import type { BorrowStatus } from "@/types/borrow";

export type StatusAction = {
  label: string;
  newStatus: string;
  variant: "default" | "outline" | "destructive";
  requiresConfirmation?: boolean;
  confirmMessage?: string;
};

export function getOrderActions(status: OrderStatus): StatusAction[] {
  switch (status) {
    case "pending":
      return [
        { label: "Process", newStatus: "processing", variant: "default" },
        {
          label: "Cancel",
          newStatus: "cancelled",
          variant: "destructive",
          requiresConfirmation: true,
          confirmMessage: "Are you sure you want to cancel this order?",
        },
      ];
    case "processing":
      return [
        {
          label: "Mark as Shipped",
          newStatus: "shipped",
          variant: "default",
        },
        {
          label: "Cancel",
          newStatus: "cancelled",
          variant: "destructive",
          requiresConfirmation: true,
          confirmMessage: "Are you sure you want to cancel this order?",
        },
      ];
    case "shipped":
      return [
        {
          label: "Mark as Delivered",
          newStatus: "delivered",
          variant: "outline",
        },
      ];
    case "delivered":
      return [
        { label: "Complete", newStatus: "completed", variant: "default" },
      ];
    default:
      return [];
  }
}

export function getBorrowActions(status: BorrowStatus): StatusAction[] {
  switch (status) {
    case "pending":
      return [
        { label: "Approve", newStatus: "approved", variant: "default" },
        {
          label: "Reject",
          newStatus: "rejected",
          variant: "destructive",
          requiresConfirmation: true,
          confirmMessage:
            "Are you sure you want to reject this borrowing request?",
        },
      ];
    case "approved":
    case "active":
      return [
        {
          label: "Mark as Returned",
          newStatus: "returned",
          variant: "outline",
        },
      ];
    case "overdue":
      return [
        {
          label: "Mark as Returned",
          newStatus: "returned",
          variant: "outline",
        },
      ];
    default:
      return [];
  }
}

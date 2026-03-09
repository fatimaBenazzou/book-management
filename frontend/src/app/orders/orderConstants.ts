export const statusFilters = [
  { label: "All Orders", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/20 text-amber-600",
    processing: "bg-blue-500/20 text-blue-600",
    shipped: "bg-purple-500/20 text-purple-600",
    delivered: "bg-green-500/20 text-green-600",
    completed: "bg-green-500/20 text-green-600",
    cancelled: "bg-red-500/20 text-red-600",
  };
  return statusColors[status] ?? "bg-gray-500/20 text-gray-600";
}

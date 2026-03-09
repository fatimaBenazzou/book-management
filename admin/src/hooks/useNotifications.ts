import { useQuery } from "@tanstack/react-query";
import { getAllBorrowings } from "@/api/endpoints/borrowings";
import { getAllOrders } from "@/api/endpoints/orders";

export function useNotifications() {
  const { data: borrowingsData } = useQuery({
    queryKey: ["borrowings"],
    queryFn: () => getAllBorrowings(),
  });

  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getAllOrders(),
  });

  const pendingOrders =
    ordersData?.data?.filter(
      (o: { status: string }) => o.status === "pending",
    ).length ?? 0;
  const overdueBorrowings =
    borrowingsData?.data?.filter(
      (b: { status: string }) => b.status === "overdue",
    ).length ?? 0;

  const notificationCount = pendingOrders + overdueBorrowings;

  return { pendingOrders, overdueBorrowings, notificationCount };
}

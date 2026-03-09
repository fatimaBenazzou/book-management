"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyOrders, getOrderById } from "@/lib/api";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { OrderFilters } from "./OrderFilters";
import { OrderCard } from "./OrderCard";
import { OrderDetailsModal } from "./OrderDetailsModal";

export default function OrdersClient() {
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ["my-orders", statusFilter, currentPage],
    queryFn: () =>
      getMyOrders({
        page: currentPage,
        limit: 10,
        status: statusFilter || undefined,
      }),
  });

  const { data: orderDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["order-details", selectedOrderId],
    queryFn: () => getOrderById(selectedOrderId!),
    enabled: !!selectedOrderId,
  });

  const orders = ordersResponse?.data ?? [];

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <AuthGuard>
      <div className="container mx-auto space-y-6 p-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        <OrderFilters
          statusFilter={statusFilter}
          onFilterChange={handleFilterChange}
        />

        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card className="py-12 text-center">
              <CardContent>
                <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
                <p className="text-lg text-muted-foreground">No orders found</p>
                <Link href="/search">
                  <Button className="mt-4">Start Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            orders.map((order: OrderI) => (
              <OrderCard
                key={order._id}
                order={order}
                onViewDetails={setSelectedOrderId}
              />
            ))
          )}
        </div>

        {ordersResponse?.pagination &&
          ordersResponse.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {ordersResponse.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === ordersResponse.pagination.totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}

        <OrderDetailsModal
          selectedOrderId={selectedOrderId}
          orderDetails={orderDetails}
          isLoading={isLoadingDetails}
          onClose={() => setSelectedOrderId(null)}
        />
      </div>
    </AuthGuard>
  );
}

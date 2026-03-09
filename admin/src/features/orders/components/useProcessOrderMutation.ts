import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "@/api/endpoints/orders";
import { toast } from "@/hooks/useToast";
import type { OrderStatus } from "@/types/order";

export function useProcessOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { status: OrderStatus; note?: string };
    }) => updateOrderStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
      toast({
        title: "Order processed",
        description: "The order has been processed successfully.",
        variant: "success",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process order",
        variant: "destructive",
      });
    },
  });
}

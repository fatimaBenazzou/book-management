import { useEffect, useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  SelectField,
  TextareaField,
  type AnyFieldApi,
} from "@/components/shared/FormFields";
import { processOrderFormSchema } from "@/validations/order";
import type { Order, OrderStatus } from "@/types/order";
import { useProcessOrderMutation } from "./useProcessOrderMutation";
import { ProcessOrderSummary } from "./ProcessOrderSummary";

type ProcessOrderValues = z.infer<typeof processOrderFormSchema>;

interface ProcessOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  onSuccess?: () => void;
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function ProcessOrderForm({
  open,
  onOpenChange,
  order,
  onSuccess,
}: ProcessOrderFormProps) {
  const { mutate: processOrder, isPending } = useProcessOrderMutation();

  const defaultValues = useMemo<ProcessOrderValues>(
    () => ({ status: order.status, note: "" }),
    [order],
  );

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      processOrder(
        {
          id: order._id,
          data: {
            status: value.status as OrderStatus,
            note: value.note || undefined,
          },
        },
        {
          onSuccess: () => {
            onOpenChange(false);
            onSuccess?.();
          },
        },
      );
    },
  });

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open, order._id, defaultValues, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Process Order</DialogTitle>
          <DialogDescription>
            Update the status of this order.
          </DialogDescription>
        </DialogHeader>
        <ProcessOrderSummary order={order} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="status"
            validators={{ onChange: processOrderFormSchema.shape.status }}
          >
            {(field) => (
              <SelectField
                field={field as AnyFieldApi<string>}
                label="Status"
                options={statusOptions}
                required
              />
            )}
          </form.Field>
          <form.Field
            name="note"
            validators={{ onChange: processOrderFormSchema.shape.note }}
          >
            {(field) => (
              <TextareaField
                field={field as AnyFieldApi<string>}
                label="Note"
                placeholder="Add a note about this status change..."
                rows={2}
              />
            )}
          </form.Field>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || isPending}
                >
                  {isSubmitting || isPending ? "Saving..." : "Update Order"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

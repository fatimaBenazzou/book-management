import { useEffect, useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextInputField } from "@/components/shared/FormFields";
import { categoryFormSchema } from "@/validations/category";
import type { Category } from "@/types/category";
import { useCategoryFormMutations } from "./useCategoryFormMutations";

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSuccess?: () => void;
}

export function CategoryForm({ open, onOpenChange, category, onSuccess }: CategoryFormProps) {
  const { handleSubmit, isCreating, isUpdating, isEditing } =
    useCategoryFormMutations({ category, onSuccess, onOpenChange });

  const defaultValues = useMemo<CategoryFormValues>(
    () => ({ name: category?.name ?? "" }),
    [category],
  );

  const form = useForm({ defaultValues, onSubmit: handleSubmit });

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open, category?._id, defaultValues, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the category details below." : "Fill in the details to add a new category."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
          className="space-y-4"
        >
          <form.Field name="name" validators={{ onChange: categoryFormSchema.shape.name }}>
            {(field) => <TextInputField field={field} label="Name" placeholder="Category name" required />}
          </form.Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting || isCreating || isUpdating}>
                  {isSubmitting || isCreating || isUpdating
                    ? "Saving..."
                    : isEditing ? "Update Category" : "Add Category"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

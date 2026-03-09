import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, updateCategory } from "@/api/endpoints/categories";
import { toast } from "@/hooks/useToast";
import type { Category, CategoryFormInput } from "@/types/category";

interface UseCategoryFormMutationsOptions {
  category?: Category | null;
  onSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
}

export function useCategoryFormMutations({
  category,
  onSuccess,
  onOpenChange,
}: UseCategoryFormMutationsOptions) {
  const queryClient = useQueryClient();
  const isEditing = Boolean(category);

  const { mutate: createCategoryMutation, isPending: isCreating } = useMutation(
    {
      mutationFn: (categoryData: CategoryFormInput) =>
        createCategory(categoryData),
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast({
          title: "Category added",
          description: `"${response.data?.name}" has been added.`,
          variant: "success",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to add category",
          variant: "destructive",
        });
      },
    },
  );

  const { mutate: updateCategoryMutation, isPending: isUpdating } = useMutation(
    {
      mutationFn: ({
        id,
        category: categoryData,
      }: {
        id: string;
        category: Partial<CategoryFormInput>;
      }) => updateCategory(id, categoryData),
      onSuccess: (response, { id }) => {
        queryClient.setQueryData(["categories", id], response);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast({
          title: "Category updated",
          description: `"${response.data?.name}" has been updated.`,
          variant: "success",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update category",
          variant: "destructive",
        });
      },
    },
  );

  const handleSubmit = async ({ value }: { value: { name: string } }) => {
    if (isEditing && category) {
      updateCategoryMutation(
        { id: category._id, category: value },
        { onSuccess: () => { onOpenChange(false); onSuccess?.(); } },
      );
    } else {
      createCategoryMutation(
        value as Parameters<typeof createCategoryMutation>[0],
        { onSuccess: () => { onOpenChange(false); onSuccess?.(); } },
      );
    }
  };

  return { handleSubmit, isCreating, isUpdating, isEditing };
}

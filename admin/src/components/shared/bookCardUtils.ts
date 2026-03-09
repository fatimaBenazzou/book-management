import type { Author } from "@/types/author";
import type { Category } from "@/types/category";

export function getAuthorName(author: string | Author | undefined): string {
  if (!author) return "Unknown Author";
  if (typeof author === "string") return author;
  return author.name;
}

export function getAuthorId(author: string | Author | undefined): string | null {
  if (!author) return null;
  if (typeof author === "string") return author;
  return author._id;
}

export function getCategoryName(category: string | Category | undefined): string {
  if (!category) return "Uncategorized";
  if (typeof category === "string") return category;
  return category.name;
}

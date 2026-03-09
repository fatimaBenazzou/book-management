import { Filter, ArrowUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortByOptions = [
  { label: "Title", value: "title" },
  { label: "Rating", value: "avgRating" },
  { label: "Date Added", value: "createdAt" },
  { label: "Price", value: "price.current" },
];

interface SearchFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  categories: Array<{ _id: string; name: string }>;
  onCategoryChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onToggleSortOrder: () => void;
  onClearCategory: () => void;
}

export function SearchFilters({
  searchQuery,
  selectedCategory,
  sortBy,
  sortOrder,
  categories,
  onCategoryChange,
  onSortByChange,
  onToggleSortOrder,
  onClearCategory,
}: SearchFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="default" className="gap-2">
                <span>Search: {searchQuery}</span>
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="gap-2">
                <span>
                  Category:{" "}
                  {categories.find((c) => c._id === selectedCategory)?.name ??
                    selectedCategory}
                </span>
                <button
                  type="button"
                  className="ml-1 rounded-full hover:bg-background/20"
                  onClick={onClearCategory}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full sm:w-45">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Select value={sortBy} onValueChange={onSortByChange}>
                <SelectTrigger className="w-full sm:w-37.5">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortByOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleSortOrder}
                title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
                type="button"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

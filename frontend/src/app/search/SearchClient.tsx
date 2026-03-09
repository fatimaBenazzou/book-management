"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooks, useCategories } from "@/lib/hooks";
import { SearchFilters } from "./SearchFilters";
import { SearchResultsTable } from "./SearchResultsTable";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("q") ?? "";
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") ?? "all",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") ?? "title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as "asc" | "desc") ?? "asc",
  );
  const [currentPage, setCurrentPage] = useState(
    Number.parseInt(searchParams.get("page") ?? "1"),
  );

  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.data ?? [];

  const { data: booksResponse, isLoading } = useBooks({
    search: searchQuery || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    page: currentPage,
    limit: 10,
    sort: sortBy,
    order: sortOrder,
  });

  const books = booksResponse?.data ?? [];
  const totalPages = booksResponse?.pagination?.totalPages ?? 1;

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (sortBy !== "title") params.set("sortBy", sortBy);
    if (sortOrder !== "asc") params.set("sortOrder", sortOrder);
    if (currentPage > 1) params.set("page", currentPage.toString());
    router.replace(`/search?${params.toString()}`);
  }, [searchQuery, selectedCategory, sortBy, sortOrder, currentPage, router]);

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-bold sm:text-3xl">Search Books</h1>

      <SearchFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        sortOrder={sortOrder}
        categories={categories}
        onCategoryChange={setSelectedCategory}
        onSortByChange={setSortBy}
        onToggleSortOrder={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
        onClearCategory={() => { setSelectedCategory("all"); setCurrentPage(1); }}
      />

      <p className="text-muted-foreground">
        {isLoading ? "Searching..." : (
          <>Found <strong>{books.length}</strong> book{books.length !== 1 ? "s" : ""}</>
        )}
      </p>

      <SearchResultsTable books={books} isLoading={isLoading} />

      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex gap-1">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              type="button"
            >
              &laquo;
            </Button>
            <Button variant="outline" disabled type="button">
              Page {currentPage} of {totalPages}
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              type="button"
            >
              &raquo;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchClient() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto space-y-6 p-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

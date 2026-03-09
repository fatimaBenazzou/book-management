"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Carousel, QuoteCard } from "../home";
import { AlertCircle } from "lucide-react";
import axios from "axios";

interface Quote {
  quote: string;
  author: string;
}

/**
 * Loading skeleton for quotes carousel
 */
function QuotesCarouselSkeleton() {
  return (
    <div className="rounded-xl bg-linear-to-br from-orange-500 to-purple-600 p-8">
      <div className="space-y-4">
        <Skeleton className="h-20 w-full bg-white/20" />
        <Skeleton className="h-6 w-32 bg-white/20" />
      </div>
    </div>
  );
}

export default function Quotes() {
  const {
    data: quotes = [],
    isLoading: quotesLoading,
    isError: quotesError,
    error: quotesErrorMessage,
  } = useQuery({
    queryKey: ["zenquotes"],
    queryFn: async () => {
      const response = await axios.get("/api/zenquotes");
      return response.data as Quote[];
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
      {quotesLoading ? (
        <QuotesCarouselSkeleton />
      ) : quotesError ? (
        <Alert variant="destructive" className="flex-1">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load quotes</AlertTitle>
          <AlertDescription>
            {quotesErrorMessage?.message ||
              "Unable to fetch daily quotes. Please try again later."}
          </AlertDescription>
        </Alert>
      ) : (
        <Carousel
          dots
          className="rounded-xl bg-linear-to-br from-orange-500 to-purple-600 text-white/90"
        >
          {quotes.map((quote: Quote, index: number) => (
            <QuoteCard
              key={index}
              quote={quote.quote}
              author={quote.author}
              className="border-0 bg-transparent text-white shadow-none"
            />
          ))}
        </Carousel>
      )}
    </div>
  );
}

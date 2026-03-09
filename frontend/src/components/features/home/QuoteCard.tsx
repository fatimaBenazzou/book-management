"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuoteCardProps {
  /** The quote text to display */
  quote: string;
  /** The author of the quote */
  author?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * QuoteCard component - displays an inspirational quote
 */
export function QuoteCard({ quote, author, className = "" }: QuoteCardProps) {
  return (
    <Card className={`max-w-xl shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl">Today&apos;s quote</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xl italic">&ldquo;{quote}&rdquo;</p>
        {author && (
          <p className="mt-4 self-end text-sm font-semibold">— {author}</p>
        )}
      </CardContent>
    </Card>
  );
}

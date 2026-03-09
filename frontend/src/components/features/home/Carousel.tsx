"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselProps {
  /** Array of items to display in the carousel */
  children: ReactNode[] | ReactNode;
  /** Whether to show navigation dots */
  dots?: boolean;
  /** Banner configuration for the carousel header */
  banner?: {
    enabled: boolean;
    title?: string;
  };
  /** Additional CSS classes */
  className?: string;
}

/**
 * Carousel component - displays items in a scrollable carousel
 */
export function Carousel({
  children,
  dots = false,
  banner,
  className = "",
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = Array.isArray(children) ? children : [children];
  const itemCount = items.length;

  const scrollPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? itemCount - 1 : prev - 1));
  }, [itemCount]);

  const scrollNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === itemCount - 1 ? 0 : prev + 1));
  }, [itemCount]);

  const scrollTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-advance for dots mode
  useEffect(() => {
    if (!dots) return;

    const interval = setInterval(() => {
      scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [dots, scrollNext]);

  return (
    <div className={`relative ${className}`}>
      {/* Optional Banner */}
      {banner?.enabled && banner.title && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{banner.title}</h2>
          {!dots && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={scrollPrev}
                aria-label="Previous slide"
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={scrollNext}
                aria-label="Next slide"
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-300"
          style={{
            transform: dots ? `translateX(-${currentIndex * 100}%)` : undefined,
          }}
        >
          {dots
            ? items.map((child, index) => (
                <div key={index} className="min-w-full shrink-0">
                  {child}
                </div>
              ))
            : items.map((child, index) => (
                <div key={index} className="shrink-0">
                  {child}
                </div>
              ))}
        </div>
      </div>

      {/* Navigation Arrows (for non-dot mode without banner) */}
      {!dots && !banner?.enabled && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
            onClick={scrollPrev}
            aria-label="Previous slide"
            type="button"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
            onClick={scrollNext}
            aria-label="Next slide"
            type="button"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {/* Dots Navigation */}
      {dots && (
        <div className="mt-4 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-3 bg-muted hover:bg-muted-foreground/30"
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

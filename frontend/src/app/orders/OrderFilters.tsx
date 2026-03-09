"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { statusFilters } from "./orderConstants";

interface OrderFiltersProps {
  statusFilter: string;
  onFilterChange: (value: string) => void;
}

export function OrderFilters({
  statusFilter,
  onFilterChange,
}: OrderFiltersProps) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

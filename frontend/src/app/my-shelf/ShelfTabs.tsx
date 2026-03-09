import { BookOpen, Clock, Heart, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReactNode } from "react";

interface ShelfTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  counts: {
    active: number;
    history: number;
    favourites: number;
    requests: number;
  };
  children: ReactNode;
}

export function ShelfTabs({
  activeTab,
  onTabChange,
  counts,
  children,
}: ShelfTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:inline-flex sm:h-10 sm:w-auto">
        <TabsTrigger value="reading" className="gap-2">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Currently Reading</span>
          <span className="sm:hidden">Reading</span>
          <TabBadge count={counts.active} />
        </TabsTrigger>
        <TabsTrigger value="history" className="gap-2">
          <Clock className="h-4 w-4" />
          <span>History</span>
          <TabBadge count={counts.history} />
        </TabsTrigger>
        <TabsTrigger value="favourites" className="gap-2">
          <Heart className="h-4 w-4" />
          Favourites
          <TabBadge count={counts.favourites} />
        </TabsTrigger>
        <TabsTrigger value="requests" className="gap-2">
          <FileText className="h-4 w-4" />
          Requests
          <TabBadge count={counts.requests} />
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}

function TabBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <Badge
      variant="secondary"
      className="ml-1 h-5 min-w-5 justify-center rounded-full px-1.5 text-xs"
    >
      {count}
    </Badge>
  );
}

"use client";

import { useState } from "react";
import { BookOpen, Clock, FileText, Library } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useMyBorrows, useReturnBorrow, useCancelBorrow } from "@/lib/hooks";
import { getFavorites } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { BorrowList } from "./BorrowList";
import { ShelfTabs } from "./ShelfTabs";
import { FavouritesTab } from "./FavouritesTab";

type TabType = "reading" | "history" | "favourites" | "requests";

export default function MyShelfClient() {
  const [activeTab, setActiveTab] = useState<TabType>("reading");

  const { data: activeBorrows, isLoading: loadingActive } = useMyBorrows({
    status: "active",
  });
  const { data: historyBorrows, isLoading: loadingHistory } = useMyBorrows({
    status: "returned",
  });
  const { data: favoritesData, isLoading: loadingFavorites } = useQuery({
    queryKey: ["books", "favorites"],
    queryFn: getFavorites,
  });
  const { data: requestsBorrows, isLoading: loadingRequests } = useMyBorrows(
    {},
  );

  const returnMutation = useReturnBorrow();
  const cancelMutation = useCancelBorrow();

  const handleReturn = (id: string) => {
    returnMutation.mutate(id, {
      onSuccess: () => toast.success("Book returned successfully!"),
      onError: () => toast.error("Failed to return book"),
    });
  };

  const handleCancel = (id: string) => {
    cancelMutation.mutate(id, {
      onSuccess: () => toast.success("Borrow request cancelled"),
      onError: () => toast.error("Failed to cancel request"),
    });
  };

  const activeList = activeBorrows?.data ?? [];
  const historyList = historyBorrows?.data ?? [];
  const favoritesList = favoritesData ?? [];
  const requestsList = (requestsBorrows?.data ?? []).filter(
    (b) =>
      b.status === "pending" ||
      b.status === "approved" ||
      b.status === "rejected",
  );

  return (
    <AuthGuard>
      <div className="container mx-auto space-y-8 p-4">
        <ShelfHeader />
        <ShelfTabs
          activeTab={activeTab}
          onTabChange={(v) => setActiveTab(v as TabType)}
          counts={{
            active: activeList.length,
            history: historyList.length,
            favourites: favoritesList.length,
            requests: requestsList.length,
          }}
        >
          <TabsContent value="reading" className="mt-6">
            <BorrowList
              borrows={activeList}
              isLoading={loadingActive}
              emptyIcon={<BookOpen className="h-6 w-6 text-muted-foreground" />}
              emptyMessage="You're not currently reading any borrowed books"
              showReturn
              showCancel={false}
              onReturn={handleReturn}
              onCancel={handleCancel}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <BorrowList
              borrows={historyList}
              isLoading={loadingHistory}
              emptyIcon={<Clock className="h-6 w-6 text-muted-foreground" />}
              emptyMessage="No borrow history yet"
              showReturn={false}
              showCancel={false}
              onReturn={handleReturn}
              onCancel={handleCancel}
            />
          </TabsContent>

          <TabsContent value="favourites" className="mt-6">
            <FavouritesTab
              favorites={favoritesList}
              isLoading={loadingFavorites}
            />
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <BorrowList
              borrows={requestsList}
              isLoading={loadingRequests}
              emptyIcon={<FileText className="h-6 w-6 text-muted-foreground" />}
              emptyMessage="You haven't made any borrow requests yet"
              showReturn={false}
              showCancel
              onReturn={handleReturn}
              onCancel={handleCancel}
            />
          </TabsContent>
        </ShelfTabs>
      </div>
    </AuthGuard>
  );
}

function ShelfHeader() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <Library className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">My Shelf</h1>
        <p className="text-sm text-muted-foreground">
          Manage your borrows, favorites, and reading history
        </p>
      </div>
    </div>
  );
}

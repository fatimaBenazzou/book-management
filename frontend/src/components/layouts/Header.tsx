"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Search as SearchIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import { logout as logoutAction } from "@/lib/store/slices/user";
import { logout as logoutApi } from "@/lib/api/auth";
import { CartDropdown } from "@/components/features/cart/CartDropdown";
import { getInitials } from "@/lib/utils/format";
import { useState, type FormEvent, type ChangeEvent } from "react";

export function Header() {
  const { user, isLoggedIn } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await logoutApi();
    dispatch(logoutAction());
    router.push("/auth/login");
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const fullName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User"
    : "User";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-6">
      <div className="w-10 md:w-0" />

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex max-w-md flex-1 items-center rounded-full border bg-background shadow-sm"
      >
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <SearchIcon className="h-4 w-4" />
        </Button>
        <Input
          type="text"
          placeholder="Search books, authors..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setSearchQuery("")}
          >
            ×
          </Button>
        )}
      </form>

      {/* Right side - user actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <CartDropdown />

        {isLoggedIn && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-3 h-auto py-2"
                type="button"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={fullName} />
                  <AvatarFallback>
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{fullName}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="h-4 w-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth/login">
            <Button type="button">Login</Button>
          </Link>
        )}
      </div>
    </header>
  );
}

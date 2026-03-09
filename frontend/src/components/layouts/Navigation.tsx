"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Menu,
  Home,
  Search,
  BookMarked,
  Package,
  Info,
  HelpCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setMobileMenuOpen } from "@/lib/store/slices/ui";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  authRequired?: boolean;
}

const mainNavItems: NavItem[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "Search", href: "/search", icon: Search },
  {
    title: "My Shelf",
    href: "/my-shelf",
    icon: BookMarked,
    authRequired: true,
  },
  { title: "My Orders", href: "/orders", icon: Package, authRequired: true },
];

const footerNavItems: NavItem[] = [
  { title: "About", href: "/about", icon: Info },
  { title: "Support", href: "/support", icon: HelpCircle },
  { title: "Terms & Conditions", href: "/terms", icon: FileText },
];

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
}) {
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <item.icon className="h-4 w-4" />
      {item.title}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { isLoggedIn } = useAppSelector((state) => state.user);

  const visibleMainItems = mainNavItems.filter(
    (item) => !item.authRequired || isLoggedIn,
  );

  return (
    <div className="flex h-full flex-col">
      {/* Main navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-4">
        <p className="mb-2 px-3 text-xs font-medium uppercase text-muted-foreground">
          Library
        </p>
        {visibleMainItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onNavigate}
          />
        ))}
      </nav>

      {/* Footer navigation */}
      <div className="p-4 pt-0">
        <Separator className="mb-4" />
        <nav className="flex flex-col gap-1">
          {footerNavItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              onClick={onNavigate}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

export function Navigation() {
  const dispatch = useAppDispatch();
  const { mobileMenuOpen } = useAppSelector((state) => state.ui);

  const closeMobile = () => dispatch(setMobileMenuOpen(false));

  return (
    <>
      {/* Mobile: Sheet drawer */}
      <Sheet
        open={mobileMenuOpen}
        onOpenChange={(open) => dispatch(setMobileMenuOpen(open))}
      >
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-50 md:hidden"
            aria-label="Open menu"
            type="button"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {/* Logo in mobile sheet */}
          <div className="flex h-16 items-center border-b px-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold"
              onClick={closeMobile}
            >
              <BookOpen className="h-6 w-6 text-primary" />
              <span>Book Library</span>
            </Link>
          </div>
          <SidebarContent onNavigate={closeMobile} />
        </SheetContent>
      </Sheet>

      {/* Desktop: Fixed sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 border-r bg-background md:block">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>Book Library</span>
          </Link>
        </div>
        <SidebarContent />
      </aside>
    </>
  );
}

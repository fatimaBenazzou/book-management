import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | Book Management Library",
  description: "View and manage your book orders",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

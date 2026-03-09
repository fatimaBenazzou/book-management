import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Book Management Library",
  description: "Complete your book purchase",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

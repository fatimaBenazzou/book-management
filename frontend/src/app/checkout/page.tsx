import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout | Book Management Library",
  description: "Complete your book order.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}

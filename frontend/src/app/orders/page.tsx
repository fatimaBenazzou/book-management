import type { Metadata } from "next";
import OrdersClient from "./OrdersClient";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Track and manage your orders",
};

export default function OrdersPage() {
  return <OrdersClient />;
}

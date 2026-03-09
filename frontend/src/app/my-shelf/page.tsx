import type { Metadata } from "next";
import MyShelfClient from "./MyShelfClient";

export const metadata: Metadata = {
  title: "My Shelf | Book Management Library",
  description:
    "Manage your borrows, favorites, reading history, and borrow requests.",
};

export default function MyShelfPage() {
  return <MyShelfClient />;
}

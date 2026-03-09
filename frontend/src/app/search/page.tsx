import type { Metadata } from "next";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search Books | Book Management Library",
  description: "Search and browse our collection of books with filters.",
};

export default function SearchPage() {
  return <SearchClient />;
}

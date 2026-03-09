import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  fetchPopularBooks,
  fetchNewArrivals,
  fetchRecommendations,
} from "@/lib/api/server";
import { SectionCarousel, HomeGreeting } from "@/components/features/home";
import Quotes from "@/components/features/quotes";

export const metadata: Metadata = {
  title: "Home | Book Management Library",
  description:
    "Discover popular books, new arrivals, and personalized recommendations.",
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const isAuthenticated = !!cookieStore.get("auth_token")?.value;

  const [popular, newArrivals, recommendations] = await Promise.all([
    fetchPopularBooks(10).catch(() => []),
    fetchNewArrivals(10).catch(() => []),
    isAuthenticated
      ? fetchRecommendations(10).catch(() => [])
      : Promise.resolve([]),
  ]);

  return (
    <section className="container mx-auto h-full space-y-8 p-4">
      <Quotes />

      <HomeGreeting />

      {recommendations.length > 0 && (
        <SectionCarousel
          title="Recommended for You"
          books={recommendations}
          showAllHref="/search?sort=recommended"
        />
      )}

      <SectionCarousel
        title="Most Popular"
        books={popular}
        showAllHref="/search?sortBy=avgRating&sortOrder=desc"
      />

      <SectionCarousel
        title="New Arrivals"
        books={newArrivals}
        showAllHref="/search?sortBy=createdAt&sortOrder=desc"
      />
    </section>
  );
}

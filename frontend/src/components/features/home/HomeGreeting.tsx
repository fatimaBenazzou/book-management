"use client";

export function HomeGreeting() {
  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return <h1 className="text-2xl font-bold sm:text-4xl">{greeting}</h1>;
}

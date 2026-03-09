import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to sync auth token cookie from client-side storage.
 * The cookie is set by the login flow (via /api/auth/set-cookie).
 * This middleware just lets requests pass through — the cookie is
 * available in server components via cookies().
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // If a token is passed via header (e.g. from API route), forward it
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    response.headers.set("authorization", authHeader);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

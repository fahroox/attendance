import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Simple middleware that just passes through for now
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Disable middleware for now to test
    // "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

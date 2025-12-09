import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // biarkan file next.js berjalan
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("adminToken")?.value;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/loginadmin", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

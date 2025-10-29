import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value || null;

  // Public routes that don't need auth
  const publicPaths = ["/", "/login", "/verify", "/qr-display"];
  const { pathname } = req.nextUrl;

  // Allow access to public pages
  if (publicPaths.includes(pathname)) return NextResponse.next();

  // Block protected routes if no token
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Decode token payload
    const base64 = token.split(".")[1] || "";
    // Edge runtime-compatible base64 decode
    const json = JSON.parse(atob(base64));
    const role = json.role?.toLowerCase();

    // Role-based access rules
    const roleRoutes = {
      admin: ["/dashboard/admin"],
      producer: ["/dashboard/producer", "/register-product", "/update-status", "/add-trace"],
      seller: ["/dashboard/seller", "/update-status", "/add-trace"],
      consumer: ["/dashboard/consumer", "/verify"],
    };

    // Check if route is allowed for that role
    const allowed = Object.entries(roleRoutes).some(([r, paths]) =>
      r === role && paths.some((path) => pathname.startsWith(path))
    );

    if (!allowed) {
      const redirectUrl = new URL(`/dashboard/${role || ""}`.replace(/\/$/, ""), req.url);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Middleware matcher (protects everything except static & API)
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

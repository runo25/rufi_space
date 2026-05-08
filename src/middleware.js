import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user?.role || "").toUpperCase();
  const { pathname } = req.nextUrl;

  // --- Agent dashboard routes (not login/register pages) ---
  const isAgentDashboard = pathname.startsWith("/agent") 
    && !pathname.startsWith("/agent/login") 
    && !pathname.startsWith("/agent/register");

  if (isAgentDashboard) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/agent/login", req.url));
    }
    if (role !== "AGENT") {
      // Strictly prevent Merchants or Users from accessing the Agent portal
      const fallback = role === "MERCHANT" ? "/merchant" : "/";
      return NextResponse.redirect(new URL(fallback, req.url));
    }
  }

  // --- Merchant dashboard routes (not login/register pages) ---
  const isMerchantDashboard = pathname.startsWith("/merchant") 
    && !pathname.startsWith("/merchant/login") 
    && !pathname.startsWith("/merchant/register");

  if (isMerchantDashboard) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/merchant/login", req.url));
    }
    if (role !== "MERCHANT") {
      // Agents and users can't access merchant dashboard
      const fallback = role === "AGENT" ? "/agent" : "/";
      return NextResponse.redirect(new URL(fallback, req.url));
    }
  }

  // --- Wishlist requires login ---
  if (pathname.startsWith("/wishlist") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/agent/:path*",
    "/merchant/:path*",
    "/wishlist/:path*",
  ],
};
import { NextResponse } from "next/server";

export function middleware(request) {
   const userCookie = request.cookies.get("user");
   const isAuthPage =
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register");
   const isProtectedRoute =
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/shopping-list") ||
      request.nextUrl.pathname.startsWith("/add-product") ||
      request.nextUrl.pathname.startsWith("/inventaire");

   const isAuthenticated = userCookie && userCookie.value;

   if (isProtectedRoute && !isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
   }

   if (isAuthPage && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
   }

   return NextResponse.next();
}

export const config = {
   matcher: [
      "/dashboard/:path*",
      "/login",
      "/register",
      "/shopping-list/:path*",
      "/add-product",
      "/inventaire",
   ],
};

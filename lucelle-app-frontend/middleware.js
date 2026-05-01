import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

function copyCookies(from, to) {
   from.cookies.getAll().forEach(({ name, value }) => {
      to.cookies.set(name, value);
   });
}

/** Évite les redirections ouvertes vers un autre domaine. */
function safeNextParam(next) {
   if (!next || typeof next !== "string") return "/";
   if (!next.startsWith("/") || next.startsWith("//")) return "/";
   return next;
}

export async function middleware(request) {
   const pathname = request.nextUrl.pathname;
   if (pathname === "/manifest.json") {
      return NextResponse.next();
   }

   let supabaseResponse = NextResponse.next({
      request,
   });

   const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

   if (!url || !key) {
      return supabaseResponse;
   }

   const supabase = createServerClient(url, key, {
      cookies: {
         getAll() {
            return request.cookies.getAll();
         },
         setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
               request.cookies.set(name, value);
            });
            supabaseResponse = NextResponse.next({
               request,
            });
            cookiesToSet.forEach(({ name, value, options }) => {
               supabaseResponse.cookies.set(name, value, options);
            });
         },
      },
   });

   const {
      data: { user },
   } = await supabase.auth.getUser();

   const isLogin = pathname === "/login";
   const isSignup = pathname === "/signup";
   const isAuthPage = isLogin || isSignup;

   if (!user && !isAuthPage) {
      const loginUrl = new URL("/login", request.url);
      const returnTo = pathname + request.nextUrl.search;
      loginUrl.searchParams.set("next", returnTo);
      const redirectRes = NextResponse.redirect(loginUrl);
      copyCookies(supabaseResponse, redirectRes);
      return redirectRes;
   }

   if (user && isAuthPage) {
      const nextRaw = request.nextUrl.searchParams.get("next") || "/";
      const target = safeNextParam(nextRaw);
      const redirectRes = NextResponse.redirect(new URL(target, request.url));
      copyCookies(supabaseResponse, redirectRes);
      return redirectRes;
   }

   return supabaseResponse;
}

export const config = {
   matcher: [
      "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
   ],
};

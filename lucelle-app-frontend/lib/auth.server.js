import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "lucelle_token";

export async function getAuthTokenFromCookie() {
   const store = await cookies();
   return store.get(AUTH_COOKIE_NAME)?.value || null;
}

export async function setAuthCookie(token) {
   if (!token) return;

   const store = await cookies();
   store.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
   });
}

export async function clearAuthCookie() {
   const store = await cookies();
   store.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
   });
}

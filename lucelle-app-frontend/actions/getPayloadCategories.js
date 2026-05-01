"use server";

import { getAuthTokenFromCookie } from "@/lib/auth.server";

export async function getPayloadCategories() {
   const baseUrl = process.env.PAYLOAD_INTERNAL_URL;
   if (!baseUrl) {
      throw new Error("PAYLOAD_INTERNAL_URL is not defined");
   }

   const token = await getAuthTokenFromCookie();
   if (!token) {
      throw new Error("Unauthorized: missing auth token");
   }

   const response = await fetch(
      `${baseUrl}/api/categories?limit=500&sort=name`,
      {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         cache: "no-store",
      }
   );

   if (!response.ok) {
      const body = await response.text();
      throw new Error(`Payload error ${response.status}: ${body}`);
   }

   const json = await response.json();
   return json.docs || [];
}

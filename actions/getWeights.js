"use server";

import { getAuthTokenFromCookie } from "@/lib/auth.server";

/** Liste des poids depuis Payload (même auth que les produits). */
export async function getWeights() {
   const baseUrl = process.env.PAYLOAD_INTERNAL_URL;
   if (!baseUrl) {
      console.error("PAYLOAD_INTERNAL_URL is not defined");
      return [];
   }

   const token =
      (await getAuthTokenFromCookie()) || process.env.PAYLOAD_ACTIONS_TOKEN;
   if (!token) {
      return [];
   }

   const response = await fetch(
      `${baseUrl}/api/weights?limit=500&sort=-date&depth=0`,
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
      return [];
   }

   const json = await response.json();
   const docs = json.docs || [];

   return docs.map((w) => ({
      id: w.id,
      documentId: String(w.id),
      date: w.date,
      poids: w.poids,
   }));
}

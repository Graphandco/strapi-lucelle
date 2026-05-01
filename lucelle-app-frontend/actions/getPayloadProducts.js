"use server";

import { getAuthTokenFromCookie } from "@/lib/auth.server";

function toAbsoluteMediaUrl(baseUrl, url) {
   if (!url) return null;
   if (url.startsWith("http://") || url.startsWith("https://")) return url;
   return `${baseUrl}${url}`;
}

function mapPayloadProduct(product, baseUrl) {
   const featuredUrl = toAbsoluteMediaUrl(baseUrl, product?.featuredImage?.url);

   return {
      ...product,
      documentId: String(product.id),
      isToBuy: Boolean(product.is_to_buy),
      isInCart: Boolean(product.is_in_cart),
      category: Array.isArray(product.categories) ? (product.categories[0] ?? null) : null,
      image: featuredUrl
         ? {
              formats: {
                 thumbnail: {
                    url: featuredUrl,
                 },
              },
           }
         : null,
   };
}

export async function getPayloadProducts() {
   const baseUrl = process.env.PAYLOAD_INTERNAL_URL;
   if (!baseUrl) {
      throw new Error("PAYLOAD_INTERNAL_URL is not defined");
   }

   const token = await getAuthTokenFromCookie();
   if (!token) {
      throw new Error("Unauthorized: missing auth token");
   }

   const response = await fetch(
      `${baseUrl}/api/products?limit=500&depth=1&sort=createdAt`,
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
   const docs = json.docs || [];
   return docs.map((product) => mapPayloadProduct(product, baseUrl));
}

"use server";

import { getAuthTokenFromCookie } from "@/lib/auth.server";

export async function getProducts(input = {}) {
   const baseUrl = process.env.PAYLOAD_INTERNAL_URL;
   if (!baseUrl) {
      throw new Error("PAYLOAD_INTERNAL_URL is not defined");
   }

   const token = input.token || (await getAuthTokenFromCookie());
   if (!token) {
      throw new Error("Unauthorized: missing auth token");
   }

   const response = await fetch(
      `${baseUrl}/api/products?limit=500&depth=1&sort=name`,
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
"use server";

export async function getStrapiPageBySlug(slug) {
   const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/legals?filters[slug][$eq]=${slug}&populate=*`;
   const res = await fetch(url, { cache: "no-store" }); // SSR

   if (!res.ok) throw new Error("Erreur Strapi");

   const json = await res.json();
   return json.data[0]; // ou null si non trouvé
}

export async function getStrapiProducts(collection) {
   let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/${collection}?populate=*&pagination[limit]=500`;
   const res = await fetch(url, { cache: "no-store" });

   if (!res.ok) {
      throw new Error("Erreur lors de la récupération de la collection");
   }

   const json = await res.json();

   if (json) {
      return json.data;
   }
}

export async function getStrapiProductsInCart(collection) {
   let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/${collection}?filters[isInCart][$eq]=true&populate=*&pagination[limit]=500`;
   const res = await fetch(url, { cache: "no-store" });

   if (!res.ok) {
      throw new Error(
         "Erreur lors de la récupération des produits dans le panier"
      );
   }

   const json = await res.json();

   if (json) {
      return json.data;
   }
}

export async function getStrapiProductsNotInCart(collection) {
   let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/${collection}?filters[isInCart][$eq]=false&populate=*&pagination[limit]=500`;
   const res = await fetch(url, { cache: "no-store" });

   if (!res.ok) {
      throw new Error(
         "Erreur lors de la récupération des produits hors panier"
      );
   }

   const json = await res.json();

   if (json) {
      return json.data;
   }
}

export async function getStrapiProductsToBuy(collection) {
   let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/${collection}?filters[isToBuy][$eq]=true&populate=*&pagination[limit]=500`;
   const res = await fetch(url, { cache: "no-store" });

   if (!res.ok) {
      throw new Error("Erreur lors de la récupération des produits à acheter");
   }

   const json = await res.json();

   if (json) {
      return json.data;
   }
}

export async function getStrapiProductsNotToBuy(collection) {
   let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/${collection}?filters[isToBuy][$eq]=false&populate=*&pagination[limit]=500`;
   const res = await fetch(url, { cache: "no-store" });

   if (!res.ok) {
      throw new Error(
         "Erreur lors de la récupération des produits non à acheter"
      );
   }

   const json = await res.json();

   if (json) {
      return json.data;
   }
}

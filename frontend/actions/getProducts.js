"use server";

export async function getStrapiPageBySlug(slug) {
   const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/legals?filters[slug][$eq]=${slug}&populate=*`;
   const res = await fetch(url, { cache: "no-store" }); // SSR

   if (!res.ok) throw new Error("Erreur Strapi");

   const json = await res.json();
   return json.data[0]; // ou null si non trouvé
}

export async function getStrapiProducts(collection) {
   let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/${collection}?populate=*`;
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
   let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/${collection}?filters[isInCart][$eq]=true&populate=*`;
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
   let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/${collection}?filters[isInCart][$eq]=false&populate=*`;
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
   let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/${collection}?filters[isToBuy][$eq]=true&populate=*`;
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
   let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/${collection}?filters[isToBuy][$eq]=false&populate=*`;
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

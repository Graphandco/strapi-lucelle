"use server";

export async function getCategories() {
   try {
      const response = await fetch(
         `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/categories?fields=name`,
         { cache: "no-store" }
      );

      if (!response.ok) {
         throw new Error("Erreur lors de la récupération des catégories");
      }

      const json = await response.json();
      return json.data;
   } catch (error) {
      console.error("Erreur:", error);
      return [];
   }
}

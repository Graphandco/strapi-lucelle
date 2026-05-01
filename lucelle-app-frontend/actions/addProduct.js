"use server";
import { getAuthTokenFromCookie } from "@/lib/auth.server";

export async function addProduct(formData) {
   const name = formData.get("name");
   const category = Number(formData.get("category"));
   const token = await getAuthTokenFromCookie();
   const baseUrl = process.env.PAYLOAD_INTERNAL_URL;

   const product = {
      name,
      quantity: 1,
      is_in_cart: false,
      is_to_buy: true,
      categories: Number.isFinite(category) ? [category] : [],
   };

   try {
      if (!token) {
         throw new Error("Token d'authentification manquant");
      }
      if (!baseUrl) {
         throw new Error("PAYLOAD_INTERNAL_URL is not defined");
      }

      const response = await fetch(
         `${baseUrl}/api/products`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(product),
         }
      );

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(
            errorData.error?.message || "Erreur lors de l'ajout du produit"
         );
      }

      return { success: true };
   } catch (error) {
      console.error("Erreur détaillée:", error);
      return { success: false, error: error.message };
   }
}

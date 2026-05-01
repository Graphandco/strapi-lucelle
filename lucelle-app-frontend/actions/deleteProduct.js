"use server";
import { getAuthTokenFromCookie } from "@/lib/auth.server";

export async function deleteProduct(documentId) {
   try {
      const token = await getAuthTokenFromCookie();
      const baseUrl = process.env.PAYLOAD_INTERNAL_URL;
      if (!token) {
         throw new Error("Token d'authentification manquant");
      }
      if (!baseUrl) {
         throw new Error("PAYLOAD_INTERNAL_URL is not defined");
      }

      const response = await fetch(
         `${baseUrl}/api/products/${documentId}`,
         {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
         }
      );
      if (!response.ok) {
         let errorMsg = "Erreur lors de la suppression du produit";
         try {
            const text = await response.text();
            if (text) {
               const errorData = JSON.parse(text);
               errorMsg = errorData.error?.message || errorMsg;
            }
         } catch {}
         throw new Error(errorMsg);
      }
      return { success: true };
   } catch (error) {
      console.error("Erreur suppression:", error);
      return { success: false, error: error.message };
   }
}

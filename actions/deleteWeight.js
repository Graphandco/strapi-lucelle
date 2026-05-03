"use server";

import { getAuthTokenFromCookie } from "@/lib/auth.server";

export async function deleteWeight(weightId) {
   try {
      const id = Number(weightId);
      if (!id) {
         throw new Error("ID de poids invalide");
      }

      const token =
         (await getAuthTokenFromCookie()) || process.env.PAYLOAD_ACTIONS_TOKEN;
      if (!token) {
         throw new Error(
            "Token d'authentification manquant (cookie ou PAYLOAD_ACTIONS_TOKEN)"
         );
      }

      const baseUrl = process.env.PAYLOAD_INTERNAL_URL;
      if (!baseUrl) {
         throw new Error("PAYLOAD_INTERNAL_URL is not defined");
      }

      const response = await fetch(`${baseUrl}/api/weights/${id}`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         throw new Error(
            errorData.errors?.[0]?.message ||
               errorData.message ||
               `Erreur ${response.status}`
         );
      }

      return { success: true };
   } catch (error) {
      console.error("Error deleting weight:", error);
      return { success: false, error: error.message };
   }
}

"use server";

import { getAuthTokenFromCookie } from "@/lib/auth.server";

export async function deleteExercice(exerciceId) {
   try {
      const token = await getAuthTokenFromCookie();
      if (!token) {
         throw new Error("Token d'authentification manquant");
      }

      const response = await fetch(
         `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exercices/${exerciceId}`,
         {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
         }
      );

      if (!response.ok) {
         throw new Error("Failed to delete exercice");
      }

      return { success: true };
   } catch (error) {
      console.error("Error deleting exercice:", error);
      return { success: false, error: error.message };
   }
}

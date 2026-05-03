"use server";

import { getAuthTokenFromCookie } from "@/lib/auth.server";

export async function addWeight(formData) {
   try {
      const poids = formData.get("poids");
      const date = formData.get("date");
      const token =
         (await getAuthTokenFromCookie()) || process.env.PAYLOAD_ACTIONS_TOKEN;

      if (!poids || !date) {
         return {
            success: false,
            error: "Tous les champs sont requis",
         };
      }

      if (!token) {
         return {
            success: false,
            error: "Token d'authentification manquant (cookie ou PAYLOAD_ACTIONS_TOKEN)",
         };
      }

      const baseUrl = process.env.PAYLOAD_INTERNAL_URL;
      if (!baseUrl) {
         return { success: false, error: "PAYLOAD_INTERNAL_URL is not defined" };
      }
      const siteId = Number(process.env.PAYLOAD_DEFAULT_SITE_ID);
      if (!siteId) {
         return {
            success: false,
            error: "PAYLOAD_DEFAULT_SITE_ID is not defined",
         };
      }

      const response = await fetch(`${baseUrl}/api/weights`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({
            date,
            poids: parseFloat(poids),
            site: siteId,
         }),
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         throw new Error(
            errorData.errors?.[0]?.message ||
               errorData.message ||
               `Erreur ${response.status}`
         );
      }

      const result = await response.json();
      return {
         success: true,
         data: result.doc || result,
      };
   } catch (error) {
      console.error("Erreur dans addWeight:", error);
      return {
         success: false,
         error: error.message || "Erreur lors de l'ajout de la mesure",
      };
   }
}

"use server";

import { createClient } from "@/lib/supabase/server";

const SCHEMA = "shopping_list";

export async function deleteProduct(documentId) {
   try {
      const id = documentId != null ? String(documentId).trim() : "";
      if (!id) {
         return { success: false, error: "Identifiant produit manquant." };
      }

      const supabase = await createClient();
      const {
         data: { user },
         error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
         return { success: false, error: "Tu dois être connecté." };
      }

      const { error } = await supabase
         .schema(SCHEMA)
         .from("products")
         .delete()
         .eq("id", id);

      if (error) {
         console.error("deleteProduct (Supabase):", error.message);
         return { success: false, error: error.message };
      }

      return { success: true };
   } catch (error) {
      console.error("deleteProduct:", error);
      return {
         success: false,
         error:
            error?.message || "Erreur lors de la suppression du produit",
      };
   }
}

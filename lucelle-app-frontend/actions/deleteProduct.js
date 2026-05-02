"use server";

import { createClient } from "@/lib/supabase/server";
import { shoppingListObjectPathFromImageUrl } from "@/lib/shoppingListStoragePath";

const SCHEMA = "shopping_list";
const STORAGE_BUCKET = "shopping_list";

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

      const { data: row, error: fetchError } = await supabase
         .schema(SCHEMA)
         .from("products")
         .select("image_url")
         .eq("id", id)
         .maybeSingle();

      if (fetchError) {
         console.error("deleteProduct (select):", fetchError.message);
         return { success: false, error: fetchError.message };
      }

      if (!row) {
         return { success: false, error: "Produit introuvable." };
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

      const objectPath = shoppingListObjectPathFromImageUrl(
         row.image_url,
         STORAGE_BUCKET,
      );

      if (row.image_url && !objectPath) {
         console.warn(
            "deleteProduct: image_url non reconnue pour Storage, fichier non supprimé.",
            String(row.image_url).slice(0, 160),
         );
      }

      if (objectPath) {
         const { data: removed, error: storageError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([objectPath]);

         if (storageError) {
            console.error(
               "deleteProduct (storage):",
               storageError.message,
               objectPath,
            );
         } else if (!removed?.length) {
            console.warn(
               "deleteProduct (storage): remove sans erreur mais 0 fichier supprimé.",
               "Chemin:",
               objectPath,
               "Souvent: policy SELECT manquante sur storage.objects (obligatoire en plus de DELETE pour que remove trouve l’objet). Vérifier aussi que la clé correspond exactement à celle du bucket.",
            );
         }
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

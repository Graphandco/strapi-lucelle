"use server";

import { createClient } from "@/lib/supabase/server";
import { tryUploadProductImageField } from "@/actions/uploadProductImage";

const SCHEMA = "shopping_list";

export async function addProduct(formData) {
   const nameRaw = formData.get("name");
   const categoryRaw = formData.get("category");

   const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
   if (!name) {
      return { success: false, error: "Le nom du produit est requis." };
   }

   const categoryId =
      categoryRaw != null && String(categoryRaw).trim() !== ""
         ? String(categoryRaw).trim()
         : null;
   if (!categoryId) {
      return { success: false, error: "Choisis une catégorie." };
   }

   try {
      const supabase = await createClient();
      const {
         data: { user },
         error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
         return {
            success: false,
            error: "Tu dois être connecté pour ajouter un produit.",
         };
      }

      const imageField = formData.get("image");
      const uploadResult = await tryUploadProductImageField(imageField);
      if (!uploadResult.success) {
         return { success: false, error: uploadResult.error };
      }

      const row = {
         name,
         category_id: categoryId,
      };
      if (uploadResult.url) {
         row.image_url = uploadResult.url;
      }

      const { error } = await supabase.schema(SCHEMA).from("products").insert(row);

      if (error) {
         console.error("addProduct (Supabase):", error.message);
         return { success: false, error: error.message };
      }

      return { success: true };
   } catch (error) {
      console.error("addProduct:", error);
      return {
         success: false,
         error: error?.message || "Erreur lors de l’ajout du produit",
      };
   }
}

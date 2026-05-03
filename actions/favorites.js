"use server";

import { createClient } from "@/lib/supabase/server";

const SCHEMA = "shopping_list";

/**
 * Ajoute ou retire un favori pour l’utilisateur connecté.
 * @param {string|number} productId — id du produit (colonne products.id)
 * @returns {{ favorited: boolean }}
 */
export async function setFavorite(productId) {
   const supabase = await createClient();
   const {
      data: { user },
      error: userError,
   } = await supabase.auth.getUser();

   if (userError || !user) {
      throw new Error("Vous devez être connecté pour gérer les favoris.");
   }

   const { data: existing, error: selectError } = await supabase
      .schema(SCHEMA)
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

   if (selectError) {
      console.error("favorites select:", selectError.message);
      throw new Error(selectError.message);
   }

   if (existing) {
      const { error: deleteError } = await supabase
         .schema(SCHEMA)
         .from("favorites")
         .delete()
         .eq("user_id", user.id)
         .eq("product_id", productId);

      if (deleteError) {
         console.error("favorites delete:", deleteError.message);
         throw new Error(deleteError.message);
      }

      return { favorited: false };
   }

   const { error: insertError } = await supabase
      .schema(SCHEMA)
      .from("favorites")
      .insert({ user_id: user.id, product_id: productId });

   if (insertError) {
      console.error("favorites insert:", insertError.message);
      throw new Error(insertError.message);
   }

   return { favorited: true };
}

/** Liste des product_id favoris pour l’utilisateur connecté. */
export async function getFavoriteProductIds() {
   const supabase = await createClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   if (!user) {
      return [];
   }

   const { data, error } = await supabase
      .schema(SCHEMA)
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id);

   if (error) {
      console.error("getFavoriteProductIds:", error.message);
      throw new Error(error.message);
   }

   return (data ?? []).map((row) => row.product_id);
}

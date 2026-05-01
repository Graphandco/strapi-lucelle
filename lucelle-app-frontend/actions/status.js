"use server";

import { createClient } from "@/lib/supabase/server";

const SCHEMA = "shopping_list";
/** Lignes (user_id, product_id) — présence = à acheter */
const TABLE_TO_BUY = "is_to_buy";
/** Lignes (user_id, product_id) — présence = dans le panier */
const TABLE_IN_CART = "is_in_cart";

async function requireUser(supabase) {
   const {
      data: { user },
      error: userError,
   } = await supabase.auth.getUser();

   if (userError || !user) {
      throw new Error("Vous devez être connecté.");
   }
   return user;
}

/** @returns {Promise<{ product_id: string | number, quantity: number }[]>} */
export async function listToBuyStatus() {
   const supabase = await createClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) return [];

   const { data, error } = await supabase
      .schema(SCHEMA)
      .from(TABLE_TO_BUY)
      .select("product_id, quantity")
      .eq("user_id", user.id);

   if (error) {
      console.error("listToBuyStatus:", error.message);
      throw new Error(error.message);
   }

   return (data ?? []).map((r) => ({
      product_id: r.product_id,
      quantity: Math.max(1, Number(r.quantity) || 1),
   }));
}

export async function updateToBuyQuantity(productId, quantity) {
   const supabase = await createClient();
   const user = await requireUser(supabase);

   const q = Math.floor(Number(quantity));
   if (!Number.isFinite(q) || q < 1) {
      throw new Error("Quantité invalide.");
   }

   const { data, error } = await supabase
      .schema(SCHEMA)
      .from(TABLE_TO_BUY)
      .update({ quantity: q })
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .select("product_id");

   if (error) {
      console.error("updateToBuyQuantity:", error.message);
      throw new Error(error.message);
   }

   if (!data?.length) {
      console.error(
         "updateToBuyQuantity: aucune ligne (product_id / user_id ?)",
         productId,
      );
      throw new Error(
         "Impossible de mettre à jour la quantité (ligne introuvable).",
      );
   }
}

/** @returns {Promise<string[]>} */
export async function listInCartProductIds() {
   const supabase = await createClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) return [];

   const { data, error } = await supabase
      .schema(SCHEMA)
      .from(TABLE_IN_CART)
      .select("product_id")
      .eq("user_id", user.id);

   if (error) {
      console.error("listInCartProductIds:", error.message);
      throw new Error(error.message);
   }

   return (data ?? []).map((r) => r.product_id);
}

export async function addToBuy(productId) {
   const supabase = await createClient();
   const user = await requireUser(supabase);

   const { error } = await supabase
      .schema(SCHEMA)
      .from(TABLE_TO_BUY)
      .insert({ user_id: user.id, product_id: productId, quantity: 1 });

   if (error) {
      console.error("addToBuy:", error.message);
      throw new Error(error.message);
   }
}

export async function removeToBuy(productId) {
   const supabase = await createClient();
   const user = await requireUser(supabase);

   const { error } = await supabase
      .schema(SCHEMA)
      .from(TABLE_TO_BUY)
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

   if (error) {
      console.error("removeToBuy:", error.message);
      throw new Error(error.message);
   }
}

export async function addInCart(productId) {
   const supabase = await createClient();
   const user = await requireUser(supabase);

   const { error } = await supabase
      .schema(SCHEMA)
      .from(TABLE_IN_CART)
      .insert({ user_id: user.id, product_id: productId });

   if (error) {
      console.error("addInCart:", error.message);
      throw new Error(error.message);
   }
}

export async function removeInCart(productId) {
   const supabase = await createClient();
   const user = await requireUser(supabase);

   const { error } = await supabase
      .schema(SCHEMA)
      .from(TABLE_IN_CART)
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

   if (error) {
      console.error("removeInCart:", error.message);
      throw new Error(error.message);
   }
}

/**
 * Vide le panier (`is_in_cart`) pour l’utilisateur.
 * Retire `is_to_buy` **uniquement** pour les produits qui étaient dans le panier
 * (les articles « à acheter » mais pas encore au panier restent en liste).
 */
export async function clearAllShopping() {
   const supabase = await createClient();
   const user = await requireUser(supabase);

   const { data: cartRows, error: selErr } = await supabase
      .schema(SCHEMA)
      .from(TABLE_IN_CART)
      .select("product_id")
      .eq("user_id", user.id);

   if (selErr) {
      console.error("clearAllShopping (lecture panier):", selErr.message);
      throw new Error(selErr.message);
   }

   const inCartIds = [
      ...new Set((cartRows ?? []).map((r) => r.product_id).filter(Boolean)),
   ];

   if (inCartIds.length > 0) {
      const { error: errBuy } = await supabase
         .schema(SCHEMA)
         .from(TABLE_TO_BUY)
         .delete()
         .eq("user_id", user.id)
         .in("product_id", inCartIds);

      if (errBuy) {
         console.error("clearAllShopping (is_to_buy):", errBuy.message);
         throw new Error(errBuy.message);
      }
   }

   const { error: errCart } = await supabase
      .schema(SCHEMA)
      .from(TABLE_IN_CART)
      .delete()
      .eq("user_id", user.id);

   if (errCart) {
      console.error("clearAllShopping (is_in_cart):", errCart.message);
      throw new Error(errCart.message);
   }
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
   getSupabaseProducts,
   getSupabaseMyProducts,
   getSupabaseCategories,
} from "@/actions/getSupabaseProduct";
import {
   listToBuyStatus,
   listInCartProductIds,
} from "@/actions/status";
import { getFavoriteProductIds } from "@/actions/favorites";
import { mapCatalogRow, pidKey } from "@/lib/catalogMap";

/**
 * @param {{ mode?: "catalog" | "mine" }} options
 * - `catalog` (défaut) : publics + perso de l’utilisateur.
 * - `mine` : uniquement les produits dont `user_id` = utilisateur connecté.
 */
export function useCatalogData(options = {}) {
   const mode = options.mode === "mine" ? "mine" : "catalog";
   const { user } = useAuth();
   const [products, setProducts] = useState([]);
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(true);

   /**
    * @param {{ silent?: boolean }} opts — `silent: true` : met à jour les données sans passer par l’écran « Chargement… »
    */
   const reload = useCallback(async (opts = {}) => {
      const silent = opts.silent === true;
      if (!silent) {
         setLoading(true);
      }
      try {
         const fetchProducts =
            mode === "mine" ? getSupabaseMyProducts : getSupabaseProducts;

         const [rows, cats, toBuyRows, inCartRaw, favoriteRaw] =
            await Promise.all([
               fetchProducts(),
               getSupabaseCategories(),
               listToBuyStatus(),
               listInCartProductIds(),
               getFavoriteProductIds(),
            ]);
         const toBuyQuantityByProductId = new Map(
            (toBuyRows ?? []).map((r) => [
               String(r.product_id),
               Math.max(1, Number(r.quantity) || 1),
            ]),
         );
         const inCartIds = new Set(inCartRaw.map((x) => String(x)));
         const favoriteIds = new Set(
            (favoriteRaw ?? []).map((x) => String(x)),
         );
         const mapped = (rows ?? [])
            .map((row) =>
               mapCatalogRow(
                  row,
                  toBuyQuantityByProductId,
                  inCartIds,
                  favoriteIds,
               ),
            )
            .sort((a, b) =>
               a.name.localeCompare(b.name, "fr", { sensitivity: "base" }),
            );
         setProducts(mapped);
         setCategories(
            [...(cats ?? [])]
               .map((c) => ({ ...c, id: String(c.id) }))
               .sort((a, b) =>
                  a.name.localeCompare(b.name, "fr", { sensitivity: "base" }),
               ),
         );
      } catch (e) {
         console.error("useCatalogData:", e);
      } finally {
         if (!silent) {
            setLoading(false);
         }
      }
   }, [mode]);

   useEffect(() => {
      reload();
   }, [user?.id, reload]);

   const patchProduct = useCallback((productId, partial) => {
      const key = pidKey(productId);
      setProducts((prev) =>
         prev.map((p) =>
            p.documentId === key ? { ...p, ...partial } : p,
         ),
      );
   }, []);

   /** Aligné sur `clearAllShopping` côté UI (panier vidé + retrait « à acheter » pour ce qui était au panier). */
   const optimisticClearShopping = useCallback(() => {
      setProducts((prev) =>
         prev.map((p) =>
            p.isInCart
               ? { ...p, isInCart: false, isToBuy: false }
               : { ...p, isInCart: false },
         ),
      );
   }, []);

   return {
      products,
      categories,
      loading,
      reload,
      patchProduct,
      optimisticClearShopping,
   };
}

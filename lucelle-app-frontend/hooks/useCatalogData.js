"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
   getSupabaseProducts,
   getSupabaseCategories,
} from "@/actions/getSupabaseProduct";
import {
   listToBuyStatus,
   listInCartProductIds,
} from "@/actions/status";
import { getFavoriteProductIds } from "@/actions/favorites";

function pidKey(id) {
   return id == null ? "" : String(id);
}

function mapRow(row, toBuyQuantityByProductId, inCartIds, favoriteIds) {
   const id = row.id;
   const key = pidKey(id);
   const category = row.category
      ? {
           id: String(row.category.id ?? row.category_id),
           name: row.category.name,
        }
      : row.category_id != null
        ? { id: String(row.category_id), name: "—" }
        : null;

   const isToBuy = toBuyQuantityByProductId.has(key);
   const quantity = isToBuy
      ? Math.max(1, Number(toBuyQuantityByProductId.get(key)) || 1)
      : Math.max(1, Number(row.quantity) || 1);

   return {
      id,
      documentId: key,
      name: row.name,
      isToBuy,
      isInCart: inCartIds.has(key),
      category,
      quantity,
      /** Quantité catalogue (table `products`), utile quand `isToBuy` est faux. */
      catalogBaseQuantity: Math.max(1, Number(row.quantity) || 1),
      imageUrl: row.image_url ?? null,
      image: null,
      isFavorited: favoriteIds.has(key),
   };
}

export function useCatalogData() {
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
         const [rows, cats, toBuyRows, inCartRaw, favoriteRaw] =
            await Promise.all([
               getSupabaseProducts(),
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
               mapRow(
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
   }, []);

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

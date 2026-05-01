"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
   getSupabaseProducts,
   getSupabaseCategories,
} from "@/actions/getSupabaseProduct";
import {
   listToBuyProductIds,
   listInCartProductIds,
} from "@/actions/status";

function pidKey(id) {
   return id == null ? "" : String(id);
}

function mapRow(row, toBuyIds, inCartIds) {
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

   return {
      id,
      documentId: key,
      name: row.name,
      isToBuy: toBuyIds.has(key),
      isInCart: inCartIds.has(key),
      category,
      quantity: row.quantity ?? 1,
      image: null,
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
         const [rows, cats, toBuyRaw, inCartRaw] = await Promise.all([
            getSupabaseProducts(),
            getSupabaseCategories(),
            listToBuyProductIds(),
            listInCartProductIds(),
         ]);
         const toBuyIds = new Set(toBuyRaw.map((x) => String(x)));
         const inCartIds = new Set(inCartRaw.map((x) => String(x)));
         const mapped = (rows ?? [])
            .map((row) => mapRow(row, toBuyIds, inCartIds))
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

   const updateProductQuantity = useCallback((productId, newQuantity) => {
      if (newQuantity < 1) return;
      const key = pidKey(productId);
      setProducts((prev) =>
         prev.map((p) =>
            p.documentId === key ? { ...p, quantity: newQuantity } : p,
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
      updateProductQuantity,
   };
}

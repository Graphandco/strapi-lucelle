"use client";

import {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useRef,
   useState,
} from "react";
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
import { mapCatalogRow, pidKey } from "@/lib/catalogMap";

const CatalogContext = createContext(null);

/**
 * Données catalogue partagées (évite un refetch + écran « Chargement… » à chaque navigation).
 */
export function CatalogProvider({ children }) {
   const { user } = useAuth();
   const [products, setProducts] = useState([]);
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(true);
   /** Après au moins un chargement réussi pour l’utilisateur courant : pas d’écran bloquant sur les reload suivants. */
   const dataLoadedRef = useRef(false);

   const reload = useCallback(
      async (opts = {}) => {
         const silent = opts.silent === true;
         if (!user?.id) {
            dataLoadedRef.current = false;
            setProducts([]);
            setCategories([]);
            setLoading(false);
            return;
         }

         const showBlockingLoader = !silent && !dataLoadedRef.current;
         if (showBlockingLoader) {
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
                     a.name.localeCompare(b.name, "fr", {
                        sensitivity: "base",
                     }),
                  ),
            );
            dataLoadedRef.current = true;
         } catch (e) {
            console.error("CatalogProvider:", e);
         } finally {
            if (showBlockingLoader) {
               setLoading(false);
            }
         }
      },
      [user?.id],
   );

   useEffect(() => {
      if (!user?.id) {
         dataLoadedRef.current = false;
         setProducts([]);
         setCategories([]);
         setLoading(false);
         return;
      }
      reload();
   }, [user?.id, reload]);

   const patchProduct = useCallback((productId, partial) => {
      const key = pidKey(productId);
      setProducts((prev) =>
         prev.map((p) => (p.documentId === key ? { ...p, ...partial } : p)),
      );
   }, []);

   const optimisticClearShopping = useCallback(() => {
      setProducts((prev) =>
         prev.map((p) =>
            p.isInCart
               ? { ...p, isInCart: false, isToBuy: false }
               : { ...p, isInCart: false },
         ),
      );
   }, []);

   const value = {
      products,
      categories,
      loading,
      reload,
      patchProduct,
      optimisticClearShopping,
   };

   return (
      <CatalogContext.Provider value={value}>
         {children}
      </CatalogContext.Provider>
   );
}

/**
 * @param {{ mode?: "catalog" | "mine" }} [options] — `mine` réservé ; aujourd’hui tout le catalogue est en mode `catalog`.
 */
export function useCatalogData(options = {}) {
   const ctx = useContext(CatalogContext);
   if (!ctx) {
      throw new Error("useCatalogData doit être utilisé dans un CatalogProvider");
   }
   if (options.mode === "mine") {
      console.warn(
         "useCatalogData({ mode: 'mine' }) : non géré par CatalogProvider, utilisation du catalogue partagé.",
      );
   }
   return ctx;
}

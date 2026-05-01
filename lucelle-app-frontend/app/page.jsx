"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import { getSupabaseProducts } from "@/actions/getSupabaseProduct";
import { getFavoriteProductIds } from "@/actions/favorites";
import ProductCard from "@/components/products/ProductCard";
import SupabaseProductRow from "@/components/products/SupabaseProductRow";
import Image from "next/image";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Homepage() {
   const { user } = useAuth();
   const { allProducts, loading } = useProducts();
   const [supabaseProducts, setSupabaseProducts] = useState([]);
   const [supabaseError, setSupabaseError] = useState(null);
   const [favoriteIdSet, setFavoriteIdSet] = useState(() => new Set());

   useEffect(() => {
      let cancelled = false;
      Promise.all([getSupabaseProducts(), getFavoriteProductIds()])
         .then(([rows, favoriteIds]) => {
            if (cancelled) return;
            setSupabaseProducts(rows);
            setFavoriteIdSet(
               new Set(favoriteIds.map((id) => (id == null ? "" : String(id)))),
            );
         })
         .catch((err) => {
            if (!cancelled) setSupabaseError(err.message ?? "Erreur Supabase");
         });
      return () => {
         cancelled = true;
      };
   }, [user?.id]);

   // Filtrer les produits qui sont à acheter
   const productsToBuy = allProducts.filter((product) => product.isToBuy);
   // Filtrer les produits qui ne sont pas dans le panier
   const productsNotInCart = productsToBuy.filter(
      (product) => !product.isInCart,
   );

   if (loading) {
      return <div>Chargement...</div>;
   }
   const areProductsToBuy = productsNotInCart.length > 0;

   return (
      <ProtectedRoute>
         <div className="">
            <div className="py-3 space-y-1 text-center">
               {areProductsToBuy && (
                  <Image
                     src="/full-cart.png"
                     alt="Caddie plein"
                     width={100}
                     height={100}
                     className="mx-auto"
                     priority
                  />
               )}
               <div className="text-primary text-lg font-base">
                  Bienvenue {user?.username} !
               </div>
               <div className="text-white text-sm">
                  {areProductsToBuy
                     ? `Voici la liste des ${productsNotInCart.length} produits à acheter`
                     : "Aucun produit à acheter"}
               </div>
            </div>
            {areProductsToBuy ? (
               <ul className="bg-card rounded-lg px-3 pb-1 mt-5">
                  {productsNotInCart.map((product) => (
                     <ProductCard
                        key={product.documentId}
                        product={product}
                        pageType="homepage"
                     />
                  ))}
               </ul>
            ) : (
               <Image
                  src="/empty-cart.png"
                  alt="Caddie vide"
                  width={300}
                  height={300}
                  className="mx-auto mt-10"
                  priority
               />
            )}
            <div className="mt-8 px-3 text-left">
               <p className="text-primary text-sm font-medium mb-2">
                  Produits (Supabase)
               </p>
               {supabaseError ? (
                  <p className="text-destructive text-sm">{supabaseError}</p>
               ) : (
                  <ul className="rounded-lg border border-white/10 bg-card px-3">
                     {supabaseProducts.map((row, i) => (
                        <SupabaseProductRow
                           key={row.id ?? `${row.name}-${i}`}
                           product={row}
                           initialFavorite={favoriteIdSet.has(
                              row.id == null ? "" : String(row.id),
                           )}
                        />
                     ))}
                  </ul>
               )}
            </div>
         </div>
      </ProtectedRoute>
   );
}

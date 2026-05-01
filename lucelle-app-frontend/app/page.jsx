"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import { getSupabaseProducts } from "@/actions/getSupabaseProduct";
import ProductCard from "@/components/products/ProductCard";
import Image from "next/image";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Homepage() {
   const { user } = useAuth();
   const { allProducts, loading } = useProducts();
   const [supabaseProducts, setSupabaseProducts] = useState([]);
   const [supabaseError, setSupabaseError] = useState(null);

   useEffect(() => {
      let cancelled = false;
      getSupabaseProducts()
         .then((rows) => {
            if (!cancelled) setSupabaseProducts(rows);
         })
         .catch((err) => {
            if (!cancelled) setSupabaseError(err.message ?? "Erreur Supabase");
         });
      return () => {
         cancelled = true;
      };
   }, []);

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
                  <ul className="text-white text-sm list-disc list-inside space-y-1">
                     {supabaseProducts.map((row, i) => (
                        <li key={row.id ?? `${row.name}-${i}`}>
                           {row.name}
                           {row.category?.name != null && (
                              <span className="text-white/60">
                                 {" "}
                                 — {row.category.name}
                              </span>
                           )}
                        </li>
                     ))}
                  </ul>
               )}
            </div>
         </div>
      </ProtectedRoute>
   );
}

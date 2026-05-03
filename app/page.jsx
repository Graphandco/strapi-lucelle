"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCatalogData } from "@/hooks/useCatalogData";
import ProductCard from "@/components/products/ProductCard";
import Image from "next/image";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useCallback } from "react";

export default function Homepage() {
   const { user } = useAuth();
   const {
      products: allProducts,
      loading,
      reload,
      patchProduct,
   } = useCatalogData();

   const reconcile = useCallback(() => reload({ silent: true }), [reload]);

   /** À acheter mais pas encore marqués « dans le panier » (rappel avant / pendant les courses). */
   const productsToBuyNotInCart = allProducts.filter(
      (product) => product.isToBuy && !product.isInCart,
   );

   if (loading) {
      return <div>Chargement...</div>;
   }

   const hasItems = productsToBuyNotInCart.length > 0;

   return (
      <ProtectedRoute>
         <div className="">
            <div className="py-3 space-y-1 text-center">
               {hasItems && (
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
                  {hasItems ? (
                     <div className="flex items-center justify-center gap-2">
                        <span className="text-primary text-2xl inline-block">
                           {productsToBuyNotInCart.length}
                        </span>
                        <span className="">
                           produit{productsToBuyNotInCart.length > 1 ? "s" : ""}{" "}
                           dans la liste de courses
                        </span>
                     </div>
                  ) : (
                     "Rien à acheter pour l’instant, ajoutez des produits à votre liste !"
                  )}
               </div>
            </div>
            {hasItems ? (
               <ul className="px-3 pb-1 mt-5">
                  {productsToBuyNotInCart.map((product) => (
                     <ProductCard
                        key={product.documentId}
                        product={product}
                        pageType="homepage"
                        patchProduct={patchProduct}
                        reconcile={reconcile}
                     />
                  ))}
               </ul>
            ) : (
               <Image
                  src="/badger.png"
                  alt="Caddie vide"
                  width={1289}
                  height={2219}
                  className="mx-auto mt-10 max-w-44"
                  priority
               />
            )}
         </div>
      </ProtectedRoute>
   );
}

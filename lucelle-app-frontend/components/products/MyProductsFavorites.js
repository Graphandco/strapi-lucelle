"use client";

import { useCallback } from "react";
import Image from "next/image";
import { useCatalogData } from "@/hooks/useCatalogData";
import ProductCard from "@/components/products/ProductCard";

export default function MyProductsFavorites() {
   const { products: allProducts, categories, loading, reload, patchProduct } =
      useCatalogData();

   const reconcile = useCallback(() => reload({ silent: true }), [reload]);

   const favoriteProducts = allProducts.filter((p) => p.isFavorited);

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="text-white">Chargement...</div>
         </div>
      );
   }

   return (
      <div>
         <h1 className="text-2xl mb-3 px-1 text-primary flex items-center gap-2">
            Mes favoris
            <span className="text-base text-white mt-1">
               ({favoriteProducts.length})
            </span>
         </h1>

         {favoriteProducts.length === 0 ? (
            <>
               <p className="text-center text-white">
                  Aucun produit en favori pour le moment.
               </p>
               <Image
                  src="/empty-cart.png"
                  alt="Aucun favori"
                  width={150}
                  height={150}
                  className="mx-auto mt-5 opacity-60"
                  priority
               />
            </>
         ) : (
            categories.map((category) => {
               const productsInCategory = favoriteProducts.filter(
                  (product) => product.category?.id === category.id,
               );

               if (productsInCategory.length === 0) return null;

               return (
                  <div key={category.id} className="mb-6">
                     <h3 className="text-lg text-white font-medium mb-2">
                        {category.name}
                     </h3>
                     <ul className="bg-card rounded-lg px-3 pb-2">
                        {productsInCategory.map((product) => (
                           <ProductCard
                              key={product.documentId}
                              product={product}
                              pageType="inventaire"
                              patchProduct={patchProduct}
                              reconcile={reconcile}
                           />
                        ))}
                     </ul>
                  </div>
               );
            })
         )}
      </div>
   );
}

"use client";

import { useCatalogData } from "@/hooks/useCatalogData";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useCallback } from "react";

export default function Inventaire() {
   const {
      products: allProducts,
      categories,
      loading,
      reload,
      patchProduct,
      updateProductQuantity,
   } = useCatalogData();

   const reconcile = useCallback(() => reload({ silent: true }), [reload]);

   if (loading) {
      return <div>Chargement...</div>;
   }

   return (
      <div>
         <div className="flex justify-between items-center">
            <h1 className="text-2xl mb-3 px-1 text-primary flex items-center gap-2">
               Inventaire
               <span className="text-base text-white mt-1">
                  ({allProducts.length})
               </span>
            </h1>
            <Link
               href="/add-product"
               className="flex flex-col items-center px-2 "
            >
               <PlusCircle size={26} className="" />
            </Link>
         </div>
         {categories.map((category) => {
            const productsInCategory = allProducts.filter(
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
                           updateProductQuantity={updateProductQuantity}
                        />
                     ))}
                  </ul>
               </div>
            );
         })}
      </div>
   );
}

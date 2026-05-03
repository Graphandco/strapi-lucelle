"use client";

import { useCallback, useMemo } from "react";
import Image from "next/image";
import { useCatalogData } from "@/hooks/useCatalogData";
import { useAuth } from "@/contexts/AuthContext";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function renderProductsByCategory(
   categories,
   productList,
   patchProduct,
   reconcile,
   { showOwnerDelete = false } = {},
) {
   return categories.map((category) => {
      const productsInCategory = productList.filter(
         (product) => product.category?.id === category.id,
      );

      if (productsInCategory.length === 0) return null;

      return (
         <div key={category.id} className="mb-6">
            <h3 className="text-lg text-white font-medium mb-2">
               {category.name}
            </h3>
            <ul className="rounded-lg px-3 pb-2">
               {productsInCategory.map((product) => (
                  <ProductCard
                     key={product.documentId}
                     product={product}
                     pageType="inventaire"
                     patchProduct={patchProduct}
                     reconcile={reconcile}
                     showOwnerDelete={showOwnerDelete}
                  />
               ))}
            </ul>
         </div>
      );
   });
}

export default function MyProductsFavorites() {
   const { user } = useAuth();
   const {
      products: allProducts,
      categories,
      loading,
      reload,
      patchProduct,
   } = useCatalogData();

   const reconcile = useCallback(() => reload({ silent: true }), [reload]);

   const uid = user?.id ? String(user.id) : null;

   const ownedProducts = useMemo(() => {
      if (!uid) return [];
      return allProducts.filter((p) => p.ownerUserId === uid);
   }, [allProducts, uid]);

   const favoriteProducts = useMemo(
      () => allProducts.filter((p) => p.isFavorited),
      [allProducts],
   );

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="text-white">Chargement...</div>
         </div>
      );
   }

   return (
      <div className="">
         <div className="space-y-12">
            <section>
               <h1 className="text-lg mb-3 px-1 text-primary flex items-center gap-2">
                  Mes favoris
                  <span className="text-base text-white mt-1">
                     ({favoriteProducts.length})
                  </span>
               </h1>
               {favoriteProducts.length === 0 ? (
                  <p className="text-center text-sm text-white">
                     Aucun produit favori
                  </p>
               ) : (
                  renderProductsByCategory(
                     categories,
                     favoriteProducts,
                     patchProduct,
                     reconcile,
                  )
               )}
            </section>
            <section>
               <h2 className="text-lg mb-3 px-1 text-primary flex items-center gap-2">
                  Mes produits
                  <span className="text-base text-white mt-1">
                     ({ownedProducts.length})
                  </span>
               </h2>
               {ownedProducts.length === 0 ? (
                  <p className="text-center text-sm text-white">
                     Aucun produit personnel
                  </p>
               ) : (
                  renderProductsByCategory(
                     categories,
                     ownedProducts,
                     patchProduct,
                     reconcile,
                     { showOwnerDelete: true },
                  )
               )}
            </section>
         </div>
         <Link href="/add-product" className="mt-5 flex justify-end ">
            <Button size="sm">Ajouter un produit</Button>
         </Link>
      </div>
   );
}

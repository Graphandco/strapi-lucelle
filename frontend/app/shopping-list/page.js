"use client";

import { getCategories } from "@/actions/categories";
import { useProducts } from "@/contexts/ProductContext";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";

export default function ShoppingList() {
   const { allProducts, loading } = useProducts();
   const [categories, setCategories] = useState([]);

   useEffect(() => {
      const loadCategories = async () => {
         const data = await getCategories();
         setCategories(data);
      };
      loadCategories();
   }, []);

   // Filtrer les produits qui sont à acheter
   const productsToBuy = allProducts.filter((product) => product.isToBuy);
   // Filtrer les produits non dans le panier
   const productsNotInCartFiltered = productsToBuy.filter(
      (product) => !product.isInCart
   );
   // Filtrer les produits dans le panier
   const productsInCartFiltered = productsToBuy.filter(
      (product) => product.isInCart
   );

   if (loading) {
      return <div>Chargement...</div>;
   }

   return (
      <div className="">
         <div className="grid gap-8">
            {/* Liste des produits non dans le panier, triés par catégorie */}
            <div>
               <h2 className="text-xl font-semibold mb-4">À acheter</h2>
               {categories.map((category) => {
                  const productsInCategory = productsNotInCartFiltered.filter(
                     (product) => product.category?.id === category.id
                  );

                  if (productsInCategory.length === 0) return null;

                  return (
                     <div key={category.id} className="mb-6">
                        <h3 className="text-lg text-white font-medium mb-2">
                           {category.name}
                        </h3>
                        <ul className="space-y-3">
                           {productsInCategory.map((product) => (
                              <ProductCard
                                 key={product.documentId}
                                 product={product}
                                 pageType="shopping-list"
                              />
                           ))}
                        </ul>
                     </div>
                  );
               })}
            </div>

            {/* Liste des produits dans le panier */}
            {productsInCartFiltered.length > 0 && (
               <div>
                  <h2 className="text-xl font-semibold mb-4">Dans le panier</h2>
                  <ul className="space-y-3">
                     {productsInCartFiltered.map((product) => (
                        <ProductCard
                           key={product.documentId}
                           product={product}
                           pageType="shopping-list"
                        />
                     ))}
                  </ul>
               </div>
            )}
         </div>
      </div>
   );
}

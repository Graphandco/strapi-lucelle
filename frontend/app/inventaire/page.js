"use client";

import { getCategories } from "@/actions/categories";
import { useProducts } from "@/contexts/ProductContext";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";

export default function Inventaire() {
   const { allProducts, loading } = useProducts();
   const [categories, setCategories] = useState([]);

   useEffect(() => {
      const loadCategories = async () => {
         const data = await getCategories();
         setCategories(data);
      };
      loadCategories();
   }, []);

   if (loading) {
      return <div>Chargement...</div>;
   }

   return (
      <div className="">
         <div className="grid gap-8">
            {/* Liste des produits triés par catégorie */}
            <div>
               <h2 className="text-xl font-semibold mb-4">Inventaire</h2>
               {categories.map((category) => {
                  const productsInCategory = allProducts.filter(
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
                                 pageType="inventaire"
                              />
                           ))}
                        </ul>
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
   );
}

"use client";

import { useProducts } from "@/contexts/ProductContext";
import ProductCard from "@/components/ProductCard";

export const metadata = {
   title: "Inventaire | Graph and Shop",
};

export default function Inventaire() {
   const { allProducts, categories, loading } = useProducts();

   if (loading) {
      return <div>Chargement...</div>;
   }

   return (
      <div className="">
         <div className="grid gap-8">
            {/* Liste des produits triés par catégorie */}
            <div>
               <h1 className="text-2xl mb-3 px-1 text-primary/50 flex items-center gap-2">
                  Inventaire
                  <span className="text-base text-white mt-1">
                     ({allProducts.length})
                  </span>
               </h1>
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
                        <ul className="bg-card rounded-lg px-3 pb-2">
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

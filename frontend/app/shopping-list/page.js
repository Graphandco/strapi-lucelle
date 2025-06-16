"use client";

import { getCategories } from "@/actions/categories";
import { useProducts } from "@/contexts/ProductContext";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function ShoppingList() {
   const { allProducts, updateProductToBuy, loading } = useProducts();
   const { user } = useAuth();
   const [categories, setCategories] = useState([]);
   const [isClearing, setIsClearing] = useState(false);

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
   const productsNotInCart = productsToBuy.filter(
      (product) => !product.isInCart
   );
   // Filtrer les produits dans le panier
   const productsInCart = productsToBuy.filter((product) => product.isInCart);

   const handleClearCart = async () => {
      if (!user?.jwt || isClearing) return;

      setIsClearing(true);
      try {
         // Mettre à jour chaque produit du panier de manière séquentielle
         for (const product of productsInCart) {
            try {
               await updateProductToBuy(
                  product.documentId,
                  product.isToBuy,
                  user.jwt
               );
            } catch (error) {
               console.error(
                  `Erreur lors de la mise à jour du produit ${product.name}:`,
                  error
               );
               // Continue avec le prochain produit même si celui-ci échoue
            }
         }
      } catch (error) {
         console.error("Erreur lors du vidage du panier:", error);
      } finally {
         setIsClearing(false);
      }
   };

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
                  const productsInCategory = productsNotInCart.filter(
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
            {productsInCart.length > 0 && (
               <div>
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-xl font-semibold ">Dans le panier</h2>
                     <button
                        className="text-sm text-white disabled:opacity-50"
                        onClick={handleClearCart}
                        disabled={isClearing}
                     >
                        {isClearing ? "Vidage en cours..." : "Vider le panier"}
                     </button>
                  </div>
                  <ul className="space-y-3">
                     {productsInCart.map((product) => (
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

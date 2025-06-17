"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import ProductCard from "@/components/ProductCard";

export default function Homepage() {
   const { user } = useAuth();
   const { allProducts, loading } = useProducts();

   // Filtrer les produits qui sont à acheter
   const productsToBuy = allProducts.filter((product) => product.isToBuy);
   // Filtrer les produits qui ne sont pas dans le panier
   const productsNotInCart = productsToBuy.filter(
      (product) => !product.isInCart
   );

   if (loading) {
      return <div>Chargement...</div>;
   }
   if (productsNotInCart.length === 0) {
      return <div>Aucun produit à acheter</div>;
   }

   return (
      <div className="">
         <ul className="space-y-3">
            {productsNotInCart.map((product) => (
               <ProductCard
                  key={product.documentId}
                  product={product}
                  pageType="homepage"
               />
            ))}
         </ul>
      </div>
   );
}

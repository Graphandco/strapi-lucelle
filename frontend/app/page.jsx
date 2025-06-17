"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";

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
   const areProductsToBuy = productsNotInCart.length > 0;

   return (
      <div className="">
         <div className="py-3 space-y-1 text-center">
            <div className="text-primary/50">
               Bienvenue {user?.user?.username} !
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
      </div>
   );
}

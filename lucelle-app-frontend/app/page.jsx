"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCatalogData } from "@/hooks/useCatalogData";
import ProductCard from "@/components/products/ProductCard";
import Image from "next/image";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Homepage() {
   const { user } = useAuth();
   const { products: allProducts, loading, reload } = useCatalogData();

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
                  {hasItems
                     ? `Encore à prendre / mettre au panier (${productsToBuyNotInCart.length}) — touchez quand c’est fait`
                     : "Tout est au panier ou rien à acheter pour l’instant"}
               </div>
            </div>
            {hasItems ? (
               <ul className="bg-card rounded-lg px-3 pb-1 mt-5">
                  {productsToBuyNotInCart.map((product) => (
                     <ProductCard
                        key={product.documentId}
                        product={product}
                        pageType="homepage"
                        onReload={reload}
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
      </ProtectedRoute>
   );
}

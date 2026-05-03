"use client";
import Image from "next/image";

import { useCatalogData } from "@/hooks/useCatalogData";
import ProductCard from "@/components/products/ProductCard";
import { useCallback, useState } from "react";
import SearchBar from "@/components/products/SearchBar";
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Recycle } from "lucide-react";
import ConfirmAlert from "@/components/ConfirmAlert";
import { clearAllShopping } from "@/actions/status";

export default function ShoppingList() {
   const {
      products: allProducts,
      categories,
      loading,
      reload,
      patchProduct,
      optimisticClearShopping,
   } = useCatalogData();
   const [isClearing, setIsClearing] = useState(false);

   const reconcile = useCallback(() => reload({ silent: true }), [reload]);

   const productsToBuy = allProducts.filter((product) => product.isToBuy);
   const productsNotInCart = productsToBuy.filter(
      (product) => !product.isInCart,
   );
   const productsInCart = productsToBuy.filter((product) => product.isInCart);

   const handleClearCart = async () => {
      if (isClearing) return;

      setIsClearing(true);
      optimisticClearShopping();
      try {
         await clearAllShopping();
      } catch (error) {
         console.error("Erreur lors du vidage de la liste:", error);
         await reload({ silent: true });
      } finally {
         setIsClearing(false);
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="text-white">Chargement...</div>
         </div>
      );
   }

   return (
      <div className="">
         <h1 className="text-lg mb-3 px-1 text-primary flex items-center gap-2">
            Liste de courses
            <span className="text-base text-white mt-1">
               ({productsNotInCart.length})
            </span>
         </h1>
         <SearchBar
            allProducts={allProducts}
            patchProduct={patchProduct}
            reconcile={reconcile}
         />
         {productsToBuy.length === 0 ? (
            <>
               <p className="text-center text-white">
                  Aucun produit dans la liste !
               </p>
            </>
         ) : (
            <div className="grid gap-8">
               {productsNotInCart.length > 0 && (
                  <div className="rounded-lg px-3 pb-1">
                     {categories.map((category) => {
                        const productsInCategory = productsNotInCart.filter(
                           (product) => product.category?.id === category.id,
                        );

                        if (productsInCategory.length === 0) return null;

                        return (
                           <div key={category.id} className="mt-3">
                              <h3 className="text-sm text-bg mb-2 text-primary/50">
                                 {category.name}
                              </h3>
                              <ul className="pb-2">
                                 {productsInCategory.map((product) => (
                                    <ProductCard
                                       key={product.documentId}
                                       product={product}
                                       pageType="shopping-list"
                                       patchProduct={patchProduct}
                                       reconcile={reconcile}
                                    />
                                 ))}
                              </ul>
                           </div>
                        );
                     })}
                  </div>
               )}

               {productsInCart.length > 0 && (
                  <div>
                     <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                           <AccordionTrigger>
                              <div className="flex items-center gap-2">
                                 <Check size={20} className="text-primary" />
                                 Déjà dans le panier
                              </div>
                           </AccordionTrigger>
                           <AccordionContent className="text-center">
                              <>
                                 <ul className="rounded-lg px-3 py-2">
                                    {productsInCart.map((product) => (
                                       <ProductCard
                                          key={product.documentId}
                                          product={product}
                                          pageType="shopping-list"
                                          patchProduct={patchProduct}
                                          reconcile={reconcile}
                                       />
                                    ))}
                                 </ul>

                                 <ConfirmAlert
                                    title="Vider la liste de courses ?"
                                    description="Le panier sera vidé. Les articles qui y étaient seront retirés de « à acheter » ; le reste de la liste à acheter est conservé."
                                    action={handleClearCart}
                                    notif="La liste à acheter a été vidée !"
                                    confirmText="Vider"
                                 >
                                    <div className="mt-4">
                                       <div
                                          className="rounded-lg text-sm font-normal text-black disabled:opacity-50 bg-primary py-2 px-6 inline-flex items-center gap-2 cursor-pointer hover:bg-primary-dark transition-colors"
                                          role="button"
                                          tabIndex={0}
                                          disabled={isClearing}
                                       >
                                          {isClearing ? (
                                             "Vidage en cours..."
                                          ) : (
                                             <>
                                                <Recycle size={20} /> Vider
                                             </>
                                          )}
                                       </div>
                                    </div>
                                 </ConfirmAlert>
                              </>
                           </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                  </div>
               )}
            </div>
         )}
      </div>
   );
}

"use client";

import { useProducts } from "@/contexts/ProductContext";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";
import { Recycle } from "lucide-react";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";

export const metadata = {
   title: "Liste de courses | Graph and Shop",
};

export default function ShoppingList() {
   const {
      allProducts,
      categories,
      updateProductToBuy,
      updateProductInCart,
      updateProductQuantity,
      loading,
   } = useProducts();
   const { user } = useAuth();
   const [isClearing, setIsClearing] = useState(false);

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
               // Réinitialiser la quantité à 1
               await updateProductQuantity(product.documentId, 1, user.jwt);
               // Mettre à jour le statut isToBuy
               await updateProductToBuy(
                  product.documentId,
                  product.isToBuy,
                  user.jwt
               );
               // Mettre à jour le statut isInCart
               await updateProductInCart(
                  product.documentId,
                  product.isInCart,
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
         toast.success("Le panier a été vidé !");
      }
   };

   if (loading) {
      return (
         <div className="container flex items-center justify-center min-h-screen">
            <div className="text-white">Chargement...</div>
         </div>
      );
   }

   return (
      <div className="">
         <h1 className="text-2xl mb-3 px-1 text-primary/50 flex items-center gap-2">
            Liste de courses
            <span className="text-base text-white mt-1">
               ({productsNotInCart.length})
            </span>
         </h1>
         <SearchBar />
         {productsToBuy.length === 0 ? (
            <>
               <p className="text-center text-white">
                  Aucun produit dans la liste !
               </p>
               <Image
                  src="/empty-cart.png"
                  alt="Caddie vide"
                  width={150}
                  height={150}
                  className="mx-auto mt-5"
                  priority
               />
            </>
         ) : (
            <div className="grid gap-8">
               {/* Liste des produits non dans le panier, triés par catégorie */}
               {productsNotInCart.length > 0 && (
                  <div className="bg-card rounded-lg px-3 pb-1">
                     {categories.map((category) => {
                        const productsInCategory = productsNotInCart.filter(
                           (product) => product.category?.id === category.id
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
                                    />
                                 ))}
                              </ul>
                           </div>
                        );
                     })}
                  </div>
               )}

               {/* Liste des produits dans le panier */}
               {productsInCart.length > 0 && (
                  <div>
                     <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                           <AccordionTrigger>
                              Déjà dans le panier
                           </AccordionTrigger>
                           <AccordionContent className="text-center">
                              <>
                                 <ul className="bg-card rounded-lg px-3 py-2">
                                    {productsInCart.map((product) => (
                                       <ProductCard
                                          key={product.documentId}
                                          product={product}
                                          pageType="shopping-list"
                                       />
                                    ))}
                                 </ul>

                                 <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                       <div className="mt-4">
                                          <div
                                             className="rounded-lg text-sm text-black disabled:opacity-50 bg-primary py-2 px-6 inline-flex items-center gap-2 cursor-pointer hover:bg-primary-dark transition-colors"
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
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                       <AlertDialogHeader>
                                          <AlertDialogTitle>
                                             Vider tout le panier?
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                             Les produits seront remis dans
                                             l'inventaire.
                                          </AlertDialogDescription>
                                       </AlertDialogHeader>
                                       <AlertDialogFooter>
                                          <AlertDialogCancel>
                                             Annuler
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                             onClick={handleClearCart}
                                          >
                                             Continuer
                                          </AlertDialogAction>
                                       </AlertDialogFooter>
                                    </AlertDialogContent>
                                 </AlertDialog>
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

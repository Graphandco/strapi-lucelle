"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MinusCircle, PlusCircle } from "lucide-react";
import { addToBuy, removeToBuy, addInCart, removeInCart } from "@/actions/status";

const ProductCard = ({
   product,
   pageType,
   onReload,
   updateProductQuantity,
}) => {
   const rawThumbnail = product.image?.formats?.thumbnail?.url;
   const productImage = rawThumbnail
      ? rawThumbnail.startsWith("http://") ||
        rawThumbnail.startsWith("https://")
         ? rawThumbnail
         : `${process.env.NEXT_PUBLIC_STRAPI_URL}${rawThumbnail}`
      : null;
   const isToBuy = pageType === "inventaire" && product.isToBuy;
   const showQuantity =
      pageType === "inventaire" || pageType === "shopping-list";

   const handleQuantityChange = async (newQuantity) => {
      if (newQuantity < 0) return;
      try {
         updateProductQuantity?.(product.documentId, newQuantity);
      } catch (error) {
         console.error("Erreur lors de la mise à jour de la quantité:", error);
      }
   };

   return (
      <AnimatePresence mode="wait">
         <motion.li
            layout
            initial={{ opacity: 1, y: 0 }}
            exit={{
               opacity: 0,
               y: 20,
               transition: {
                  duration: 0.2,
                  ease: "easeOut",
               },
            }}
            className={`bg-card flex items-center justify-between py-3 px-1 cursor-pointer not-last:border-b border-white/10 ${
               isToBuy ? "opacity-20! " : "opacity-100"
            }`}
            onClick={async () => {
               try {
                  if (pageType === "inventaire") {
                     if (product.isToBuy) {
                        await removeToBuy(product.documentId);
                     } else {
                        await addToBuy(product.documentId);
                     }
                  } else if (pageType === "homepage") {
                     if (!product.isInCart) {
                        await addInCart(product.documentId);
                     }
                  } else if (pageType === "shopping-list") {
                     if (product.isInCart) {
                        await removeInCart(product.documentId);
                     } else {
                        await addInCart(product.documentId);
                     }
                  }
                  await onReload?.();
               } catch (error) {
                  console.error("Erreur statut produit:", error);
               }
            }}
         >
            <div className="flex items-center gap-4">
               <Image
                  src={productImage ? productImage : "/no-image.png"}
                  alt={product.name || "Produit sans nom"}
                  width={25}
                  height={25}
               />
               <span className="text-white text-sm">{product.name}</span>
            </div>
            {showQuantity && (
               <div
                  className="flex items-center"
                  onClick={(e) => e.stopPropagation()}
               >
                  <button
                     type="button"
                     onClick={() => handleQuantityChange(product.quantity - 1)}
                     className=" p-1 rounded-full hover:bg-primary/10 transition-colors"
                     disabled={product.quantity <= 1}
                  >
                     <MinusCircle size={16} className="text-primary/50" />
                  </button>
                  <span className="text-white min-w-[20px] text-center">
                     {product.quantity}
                  </span>
                  <button
                     type="button"
                     onClick={() => handleQuantityChange(product.quantity + 1)}
                     className=" p-1 rounded-full hover:bg-primary/10 transition-colors"
                  >
                     <PlusCircle size={16} className="text-primary/50" />
                  </button>
               </div>
            )}
         </motion.li>
      </AnimatePresence>
   );
};

export default ProductCard;

"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MinusCircle, PlusCircle, Heart, Trash } from "lucide-react";
import { toast } from "sonner";
import {
   addToBuy,
   removeToBuy,
   addInCart,
   removeInCart,
   updateToBuyQuantity,
} from "@/actions/status";
import { setFavorite } from "@/actions/favorites";
import { deleteProduct } from "@/actions/deleteProduct";

const ProductCard = ({
   product,
   pageType,
   patchProduct,
   reconcile,
   showOwnerDelete = false,
}) => {
   const [deleting, setDeleting] = useState(false);
   const rawThumbnail = product.image?.formats?.thumbnail?.url;
   const strapiOrRelative = rawThumbnail
      ? rawThumbnail.startsWith("http://") ||
        rawThumbnail.startsWith("https://")
         ? rawThumbnail
         : `${process.env.NEXT_PUBLIC_STRAPI_URL}${rawThumbnail}`
      : null;
   const productImage =
      product.imageUrl &&
      (product.imageUrl.startsWith("http://") ||
         product.imageUrl.startsWith("https://"))
         ? product.imageUrl
         : strapiOrRelative;
   const isToBuy = pageType === "inventaire" && product.isToBuy;
   const showQuantity = pageType === "shopping-list";

   const handleQuantityChange = async (newQuantity) => {
      const q = Math.floor(Number(newQuantity));
      if (!Number.isFinite(q) || q < 1 || !product.isToBuy) return;
      try {
         patchProduct?.(product.documentId, { quantity: q });
         await updateToBuyQuantity(product.documentId, q);
      } catch (error) {
         console.error("Erreur lors de la mise à jour de la quantité:", error);
         await reconcile?.();
      }
   };

   const handleDeleteOwnProduct = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (deleting) return;
      setDeleting(true);
      try {
         const r = await deleteProduct(product.documentId);
         if (!r?.success) {
            toast.error(r?.error || "Suppression impossible.");
            return;
         }
         toast.success("Produit supprimé.");
         await reconcile?.();
      } catch (err) {
         console.error(err);
         toast.error(err?.message || "Erreur lors de la suppression.");
         await reconcile?.();
      } finally {
         setDeleting(false);
      }
   };

   const handleFavoriteClick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const prev = !!product.isFavorited;
      patchProduct?.(product.documentId, { isFavorited: !prev });
      try {
         const r = await setFavorite(product.documentId);
         patchProduct?.(product.documentId, { isFavorited: r.favorited });
      } catch (error) {
         console.error("Erreur favori:", error);
         patchProduct?.(product.documentId, { isFavorited: prev });
         await reconcile?.();
      }
   };

   const qty = Math.max(1, Number(product.quantity) || 1);

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
            className={`flex items-center justify-between py-3 px-1 cursor-pointer not-last:border-b border-white/10 ${
               isToBuy ? "opacity-20! " : "opacity-100"
            }`}
            onClick={async () => {
               try {
                  if (pageType === "inventaire") {
                     const nextToBuy = !product.isToBuy;
                     if (nextToBuy) {
                        patchProduct?.(product.documentId, {
                           isToBuy: true,
                           quantity: 1,
                        });
                        await addToBuy(product.documentId);
                     } else {
                        patchProduct?.(product.documentId, {
                           isToBuy: false,
                           quantity: product.catalogBaseQuantity ?? 1,
                        });
                        await removeToBuy(product.documentId);
                     }
                  } else if (pageType === "homepage") {
                     if (!product.isInCart) {
                        patchProduct?.(product.documentId, { isInCart: true });
                        await addInCart(product.documentId);
                     }
                  } else if (pageType === "shopping-list") {
                     if (product.isInCart) {
                        patchProduct?.(product.documentId, { isInCart: false });
                        await removeInCart(product.documentId);
                     } else {
                        patchProduct?.(product.documentId, { isInCart: true });
                        await addInCart(product.documentId);
                     }
                  }
               } catch (error) {
                  console.error("Erreur statut produit:", error);
                  await reconcile?.();
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
            {pageType === "inventaire" && (
               <div
                  className="flex items-center gap-0.5 relative z-10"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
               >
                  <button
                     type="button"
                     onClick={handleFavoriteClick}
                     className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                     aria-label={
                        product.isFavorited
                           ? "Retirer des favoris"
                           : "Ajouter aux favoris"
                     }
                  >
                     <Heart
                        size={20}
                        className={
                           product.isFavorited
                              ? "text-primary fill-primary"
                              : "text-primary/45"
                        }
                     />
                  </button>
                  {showOwnerDelete ? (
                     <button
                        type="button"
                        onClick={handleDeleteOwnProduct}
                        disabled={deleting}
                        className="p-1.5 rounded-full hover:bg-red-500/15 transition-colors disabled:opacity-40"
                        aria-label="Supprimer ce produit"
                     >
                        <Trash
                           size={18}
                           className="text-red-400/90"
                           aria-hidden
                        />
                     </button>
                  ) : null}
               </div>
            )}
            {showQuantity && (
               <div
                  className="flex items-center relative z-10"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
               >
                  <button
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleQuantityChange(qty - 1);
                     }}
                     className=" p-1 rounded-full hover:bg-primary/10 transition-colors"
                     disabled={qty <= 1}
                  >
                     <MinusCircle size={16} className="text-primary/50" />
                  </button>
                  <span className="text-white min-w-[20px] text-center">
                     {qty}
                  </span>
                  <button
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleQuantityChange(qty + 1);
                     }}
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

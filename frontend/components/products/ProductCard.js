"use client";

import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import { motion, AnimatePresence } from "framer-motion";
import { MinusCircle, PlusCircle } from "lucide-react";

const ProductCard = ({ product, pageType }) => {
   const { user } = useAuth();
   const { updateProductInCart, updateProductToBuy, updateProductQuantity } =
      useProducts();
   const productImage = product.image?.formats?.thumbnail?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${product.image.formats.thumbnail.url}`
      : null;
   const isToBuy = pageType === "inventaire" && product.isToBuy;
   const showQuantity =
      pageType === "inventaire" || pageType === "shopping-list";

   const handleQuantityChange = async (newQuantity) => {
      if (!user?.jwt || newQuantity < 0) return;
      try {
         await updateProductQuantity(product.documentId, newQuantity, user.jwt);
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
               isToBuy ? "!opacity-20 " : "opacity-100"
            }`}
            onClick={async () => {
               if (!user?.jwt) return;
               if (pageType !== "inventaire") {
                  await updateProductInCart(
                     product.documentId,
                     product.isInCart,
                     user.jwt
                  );
               } else {
                  await updateProductToBuy(
                     product.documentId,
                     product.isToBuy,
                     user.jwt
                  );
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
                  onClick={(e) => e.stopPropagation()} // Empêche le clic de se propager au li
               >
                  <button
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

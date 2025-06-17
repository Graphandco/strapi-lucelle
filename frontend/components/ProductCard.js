"use client";

import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import { motion, AnimatePresence } from "framer-motion";

const ProductCard = ({ product, pageType }) => {
   const { user } = useAuth();
   const { updateProductInCart, updateProductToBuy } = useProducts();
   const productImage = product.image?.formats?.thumbnail?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${product.image.formats.thumbnail.url}`
      : null;
   const isToBuy = pageType === "inventaire" && product.isToBuy;

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
            className={`bg-card flex items-center justify-between my-1 py-2 px-1 cursor-pointer border-b border-white/5 outline  ${
               isToBuy ? "outline-white" : "outline-transparent"
            }`}
            onClick={async () => {
               if (!user?.jwt) return;
               if (pageType === "shopping-list") {
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
                  width={35}
                  height={35}
                  className="rounded-full bg-white p-1"
               />
               <span className="text-white text-sm">{product.name}</span>
               {/* <span className="text-xs text-gray-500">
                  {product.isInCart ? "Dans le panier" : "À acheter"}
               </span>
               <span className="text-xs text-gray-500">
                  {product.isToBuy ? "Liste" : "Inventaire"}
               </span> */}
            </div>
            <span className="">
               <div className="flex items-center gap-1.5 text-xs text-white">
                  <span>x</span>
                  <span>{product.quantity || 1}</span>
               </div>
            </span>
         </motion.li>
      </AnimatePresence>
   );
};

export default ProductCard;

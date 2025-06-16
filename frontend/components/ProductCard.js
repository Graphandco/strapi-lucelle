"use client";

import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";

const ProductCard = ({ product, pageType }) => {
   const { user } = useAuth();
   const { updateProductInCart, updateProductToBuy } = useProducts();
   const productImage = product.image?.formats?.thumbnail?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${product.image.formats.thumbnail.url}`
      : null;

   return (
      <li
         className="bg-card flex items-center justify-between rounded-xl py-3 px-5 cursor-pointer hover:bg-card/80 transition-colors"
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
               width={25}
               height={25}
            />
            <span className="text-white">{product.name}</span>
            <span className="text-xs text-gray-500">
               {product.isInCart ? "Dans le panier" : "À acheter"}
            </span>
            <span className="text-xs text-gray-500">
               {product.isToBuy ? "Liste" : "Inventaire"}
            </span>
         </div>
         <span className="">
            <div className="flex items-center gap-1.5">
               <span>x</span>
               <span>{product.quantity || 1}</span>
            </div>
         </span>
      </li>
   );
};

export default ProductCard;

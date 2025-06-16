"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { changeProductInCart } from "@/actions/changeProduct";
import { useAuth } from "@/contexts/AuthContext";

const ProductCard = ({ product }) => {
   const { user } = useAuth();
   const router = useRouter();
   const productImage = product.image?.formats?.thumbnail?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${product.image.formats.thumbnail.url}`
      : null;

   return (
      <li
         className="bg-card flex items-center justify-between rounded-xl py-3 px-5 cursor-pointer hover:bg-card/80 transition-colors"
         onClick={async () => {
            if (!user?.jwt) return;
            await changeProductInCart(
               product.documentId,
               product.isInCart,
               user.jwt
            );
            router.refresh();
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

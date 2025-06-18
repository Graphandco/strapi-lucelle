"use client";

import { Input } from "@/components/ui/input";
import { useProducts } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function SearchBar() {
   const { allProducts, updateProductToBuy } = useProducts();
   const { user } = useAuth();
   const [searchTerm, setSearchTerm] = useState("");
   const [filteredProducts, setFilteredProducts] = useState([]);

   // Fonction pour normaliser le texte (retirer accents, caractères spéciaux, etc.)
   const normalizeText = (text) => {
      return text
         .toLowerCase()
         .normalize("NFD")
         .replace(/[\u0300-\u036f]/g, "") // Retire les accents
         .replace(/[^a-z0-9\s]/g, "") // Garde seulement lettres, chiffres et espaces
         .replace(/\s+/g, " ") // Remplace les espaces multiples par un seul
         .trim();
   };

   useEffect(() => {
      if (searchTerm.trim() === "") {
         setFilteredProducts([]);
         return;
      }

      const normalizedSearchTerm = normalizeText(searchTerm);

      const filtered = allProducts
         .filter((product) => !product.isToBuy)
         .filter((product) => {
            const normalizedProductName = normalizeText(product.name);
            return normalizedProductName.includes(normalizedSearchTerm);
         })
         .slice(0, 99); // Limite à 5 produits
      setFilteredProducts(filtered);
   }, [searchTerm, allProducts]);

   const handleProductClick = async (product) => {
      if (!user?.jwt) return;
      await updateProductToBuy(product.documentId, product.isToBuy, user.jwt);
      setSearchTerm("");
   };

   return (
      <div className="relative mb-4">
         <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card outline-none border-none rounded-lg w-full py-2 px-4 placeholder:text-white/50 placeholder:italic placeholder:text-sm placeholder:font-light"
         />
         {filteredProducts.length > 0 && (
            <div className="my-3 rounded-lg px-3 z-10">
               <ul className="py-2 grid grid-cols-4 items-center gap-7">
                  {filteredProducts.map((product) => {
                     const productImage = product.image?.formats?.thumbnail?.url
                        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${product.image.formats.thumbnail.url}`
                        : null;

                     return (
                        <li
                           key={product.documentId}
                           onClick={() => handleProductClick(product)}
                           className="cursor-pointer text-white flex flex-col items-center gap-2"
                        >
                           <Image
                              src={
                                 productImage ? productImage : "/no-image.png"
                              }
                              alt={product.name || "Produit sans nom"}
                              width={45}
                              height={45}
                              className="h-[45px] object-contain"
                           />
                           <span className="text-white text-xs text-center">
                              {product.name}
                           </span>
                        </li>
                     );
                  })}
               </ul>
            </div>
         )}
      </div>
   );
}

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getStrapiProductsToBuy } from "@/actions/getProducts";

const ProductContext = createContext();

export function ProductProvider({ children }) {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);

   // Charger les produits au montage du composant
   useEffect(() => {
      loadProducts();
   }, []);

   const loadProducts = async () => {
      try {
         const data = await getStrapiProductsToBuy("products");
         setProducts(data);
      } catch (error) {
         console.error("Error loading products:", error);
      } finally {
         setLoading(false);
      }
   };

   const updateProductStatus = async (productId, currentStatus, token) => {
      try {
         // Mise à jour optimiste de l'UI
         setProducts((prevProducts) =>
            prevProducts.map((product) =>
               product.documentId === productId
                  ? { ...product, isInCart: !currentStatus }
                  : product
            )
         );

         // Mise à jour dans Strapi
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products/${productId}`,
            {
               method: "PUT",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({
                  data: {
                     isInCart: !currentStatus,
                  },
               }),
            }
         );

         if (!response.ok) {
            // En cas d'erreur, on revient à l'état précédent
            setProducts((prevProducts) =>
               prevProducts.map((product) =>
                  product.documentId === productId
                     ? { ...product, isInCart: currentStatus }
                     : product
               )
            );
            throw new Error("Failed to update product");
         }
      } catch (error) {
         console.error("Error updating product:", error);
         throw error;
      }
   };

   const value = {
      products,
      loading,
      updateProductStatus,
      refreshProducts: loadProducts,
   };

   return (
      <ProductContext.Provider value={value}>
         {children}
      </ProductContext.Provider>
   );
}

export function useProducts() {
   const context = useContext(ProductContext);
   if (context === undefined) {
      throw new Error("useProducts must be used within a ProductProvider");
   }
   return context;
}

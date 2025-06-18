"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getStrapiProducts } from "@/actions/getProducts";

const ProductContext = createContext();

export function ProductProvider({ children }) {
   const [allProducts, setAllProducts] = useState([]);
   const [loading, setLoading] = useState(true);

   // Charger les produits au montage du composant
   useEffect(() => {
      loadAllProducts();
   }, []);

   const loadAllProducts = async () => {
      try {
         const data = await getStrapiProducts("products");
         // Trier les produits par nom
         const sortedData = data.sort((a, b) =>
            a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
         );
         setAllProducts(sortedData);
      } catch (error) {
         console.error("Error loading products:", error);
      } finally {
         setLoading(false);
      }
   };

   const updateProductInCart = async (productId, currentStatus, token) => {
      try {
         // Mise à jour optimiste de l'UI
         setAllProducts((prevProducts) =>
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
            setAllProducts((prevProducts) =>
               prevProducts.map((product) =>
                  product.documentId === productId
                     ? { ...product, isInCart: currentStatus }
                     : product
               )
            );
            throw new Error("Failed to update product in cart");
         }
      } catch (error) {
         console.error("Error updating product in cart:", error);
         throw error;
      }
   };

   const updateProductToBuy = async (productId, currentStatus, token) => {
      try {
         // Mise à jour optimiste de l'UI
         setAllProducts((prevProducts) =>
            prevProducts.map((product) =>
               product.documentId === productId
                  ? { ...product, isToBuy: !currentStatus }
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
                     isToBuy: !currentStatus,
                  },
               }),
            }
         );

         if (!response.ok) {
            // En cas d'erreur, on revient à l'état précédent
            setAllProducts((prevProducts) =>
               prevProducts.map((product) =>
                  product.documentId === productId
                     ? { ...product, isToBuy: currentStatus }
                     : product
               )
            );
            throw new Error("Failed to update product to buy status");
         }
      } catch (error) {
         console.error("Error updating product to buy status:", error);
         throw error;
      }
   };

   const updateProductQuantity = async (productId, newQuantity, token) => {
      try {
         // Mise à jour optimiste de l'UI
         setAllProducts((prevProducts) =>
            prevProducts.map((product) =>
               product.documentId === productId
                  ? { ...product, quantity: newQuantity }
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
                     quantity: newQuantity,
                  },
               }),
            }
         );

         if (!response.ok) {
            // En cas d'erreur, on revient à l'état précédent
            setAllProducts((prevProducts) =>
               prevProducts.map((product) =>
                  product.documentId === productId
                     ? { ...product, quantity: product.quantity }
                     : product
               )
            );
            throw new Error("Failed to update product quantity");
         }
      } catch (error) {
         console.error("Error updating product quantity:", error);
         throw error;
      }
   };

   const deleteProduct = async (productId, token) => {
      try {
         // Mise à jour optimiste de l'UI
         setAllProducts((prevProducts) =>
            prevProducts.filter((product) => product.documentId !== productId)
         );

         // Suppression dans Strapi
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products/${productId}`,
            {
               method: "DELETE",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         if (!response.ok) {
            // En cas d'erreur, on revient à l'état précédent
            await loadAllProducts();
            throw new Error("Failed to delete product");
         }
      } catch (error) {
         console.error("Error deleting product:", error);
         throw error;
      }
   };

   const value = {
      allProducts,
      loading,
      updateProductInCart,
      updateProductToBuy,
      updateProductQuantity,
      deleteProduct,
      refreshProducts: loadAllProducts,
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

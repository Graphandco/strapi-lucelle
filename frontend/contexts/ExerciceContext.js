"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ExerciceContext = createContext();

export function ExerciceProvider({ children }) {
   const [allExercices, setAllExercices] = useState([]);
   const [exerciceTypes, setExerciceTypes] = useState([]);
   const [loading, setLoading] = useState(true);

   // Charger les produits et catégories au montage du composant
   useEffect(() => {
      loadAllExercices();
      loadAllExerciceTypes();
   }, []);

   const loadAllExercices = async () => {
      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exercices?populate=*&pagination[limit]=500`,
            {
               cache: "no-store",
            }
         );

         if (!response.ok) {
            throw new Error("Erreur lors de la récupération des exercices");
         }

         const json = await response.json();
         const data = json.data || [];

         // Trier les produits par nom
         // const sortedData = data.sort((a, b) =>
         //    a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
         // );
         setAllExercices(data);
      } catch (error) {
         console.error("Error loading exercices:", error);
      } finally {
         setLoading(false);
      }
   };

   const loadAllExerciceTypes = async () => {
      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exercice-types?populate=*&pagination[limit]=500`,
            {
               cache: "no-store",
            }
         );

         if (!response.ok) {
            throw new Error(
               "Erreur lors de la récupération des types d'exercices"
            );
         }

         const json = await response.json();
         const data = json.data || [];

         // Trier les types d'exercices par nom
         const sortedData = data.sort((a, b) =>
            a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
         );
         setExerciceTypes(sortedData);
      } catch (error) {
         console.error("Error loading exercices types:", error);
      }
   };

   // const updateProductInCart = async (productId, currentStatus, token) => {
   //    try {
   //       // Mise à jour optimiste de l'UI
   //       setAllProducts((prevProducts) =>
   //          prevProducts.map((product) =>
   //             product.documentId === productId
   //                ? { ...product, isInCart: !currentStatus }
   //                : product
   //          )
   //       );

   //       // Mise à jour dans Strapi
   //       const response = await fetch(
   //          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products/${productId}`,
   //          {
   //             method: "PUT",
   //             headers: {
   //                "Content-Type": "application/json",
   //                Authorization: `Bearer ${token}`,
   //             },
   //             body: JSON.stringify({
   //                data: {
   //                   isInCart: !currentStatus,
   //                },
   //             }),
   //          }
   //       );

   //       if (!response.ok) {
   //          // En cas d'erreur, on revient à l'état précédent
   //          setAllProducts((prevProducts) =>
   //             prevProducts.map((product) =>
   //                product.documentId === productId
   //                   ? { ...product, isInCart: currentStatus }
   //                   : product
   //             )
   //          );
   //          throw new Error("Failed to update product in cart");
   //       }
   //    } catch (error) {
   //       console.error("Error updating product in cart:", error);
   //       throw error;
   //    }
   // };

   // const updateProductToBuy = async (productId, currentStatus, token) => {
   //    try {
   //       // Mise à jour optimiste de l'UI
   //       setAllProducts((prevProducts) =>
   //          prevProducts.map((product) =>
   //             product.documentId === productId
   //                ? { ...product, isToBuy: !currentStatus }
   //                : product
   //          )
   //       );

   //       // Mise à jour dans Strapi
   //       const response = await fetch(
   //          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products/${productId}`,
   //          {
   //             method: "PUT",
   //             headers: {
   //                "Content-Type": "application/json",
   //                Authorization: `Bearer ${token}`,
   //             },
   //             body: JSON.stringify({
   //                data: {
   //                   isToBuy: !currentStatus,
   //                },
   //             }),
   //          }
   //       );

   //       if (!response.ok) {
   //          // En cas d'erreur, on revient à l'état précédent
   //          setAllProducts((prevProducts) =>
   //             prevProducts.map((product) =>
   //                product.documentId === productId
   //                   ? { ...product, isToBuy: currentStatus }
   //                   : product
   //             )
   //          );
   //          throw new Error("Failed to update product to buy status");
   //       }
   //    } catch (error) {
   //       console.error("Error updating product to buy status:", error);
   //       throw error;
   //    }
   // };

   // const updateProductQuantity = async (productId, newQuantity, token) => {
   //    try {
   //       // Mise à jour optimiste de l'UI
   //       setAllProducts((prevProducts) =>
   //          prevProducts.map((product) =>
   //             product.documentId === productId
   //                ? { ...product, quantity: newQuantity }
   //                : product
   //          )
   //       );

   //       // Mise à jour dans Strapi
   //       const response = await fetch(
   //          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products/${productId}`,
   //          {
   //             method: "PUT",
   //             headers: {
   //                "Content-Type": "application/json",
   //                Authorization: `Bearer ${token}`,
   //             },
   //             body: JSON.stringify({
   //                data: {
   //                   quantity: newQuantity,
   //                },
   //             }),
   //          }
   //       );

   //       if (!response.ok) {
   //          // En cas d'erreur, on revient à l'état précédent
   //          setAllProducts((prevProducts) =>
   //             prevProducts.map((product) =>
   //                product.documentId === productId
   //                   ? { ...product, quantity: product.quantity }
   //                   : product
   //             )
   //          );
   //          throw new Error("Failed to update product quantity");
   //       }
   //    } catch (error) {
   //       console.error("Error updating product quantity:", error);
   //       throw error;
   //    }
   // };

   const deleteExercice = async (exerciceId, token) => {
      try {
         // Mise à jour optimiste de l'UI
         setAllExercices((prevExercices) =>
            prevExercices.filter((exercice) => exercice.id !== exerciceId)
         );

         // Suppression dans Strapi
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exercices/${exerciceId}`,
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
            await loadAllExercices();
            throw new Error("Failed to delete exercice");
         }
      } catch (error) {
         console.error("Error deleting exercice:", error);
         throw error;
      }
   };

   // Fonction pour obtenir les parties du corps uniques depuis les types d'exercices
   const getUniqueCorps = () => {
      const corpsSet = new Set();
      exerciceTypes.forEach((type) => {
         if (type.corps) {
            corpsSet.add(type.corps);
         }
      });
      return Array.from(corpsSet).sort();
   };

   // Fonction pour obtenir les exercices par type d'exercice
   const getExercicesByType = (typeId) => {
      return allExercices
         .filter((exercice) => exercice.types_d_exercice?.id === typeId)
         .sort((a, b) => new Date(b.date) - new Date(a.date));
   };

   // Fonction pour obtenir un type d'exercice par ID
   const getExerciceTypeById = (typeId) => {
      return exerciceTypes.find((type) => type.id === typeId);
   };

   const value = {
      allExercices,
      exerciceTypes,
      loading,
      getUniqueCorps,
      getExercicesByType,
      getExerciceTypeById,
      deleteExercice,
      // updateProductInCart,
      // updateProductToBuy,
      // updateProductQuantity,
      refreshExercices: loadAllExercices,
      refreshExerciceTypes: loadAllExerciceTypes,
   };

   return (
      <ExerciceContext.Provider value={value}>
         {children}
      </ExerciceContext.Provider>
   );
}

export function useExercices() {
   const context = useContext(ExerciceContext);
   if (context === undefined) {
      throw new Error("useExercices must be used within a ExerciceProvider");
   }
   return context;
}

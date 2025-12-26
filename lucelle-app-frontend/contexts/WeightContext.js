"use client";

import { createContext, useContext, useState, useEffect } from "react";

const WeightContext = createContext();

export function WeightProvider({ children }) {
   const [allWeights, setAllWeights] = useState([]);
   const [loading, setLoading] = useState(true);

   // Charger les poids au montage du composant
   useEffect(() => {
      loadAllWeights();
   }, []);

   const loadAllWeights = async () => {
      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/weights?populate=*&pagination[limit]=500`,
            {
               cache: "no-store",
            }
         );

         if (!response.ok) {
            throw new Error("Erreur lors de la récupération des poids");
         }

         const json = await response.json();
         const data = json.data || [];

         // Trier les poids par nom
         // const sortedData = data.sort((a, b) =>
         //    a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
         // );
         setAllWeights(data);
      } catch (error) {
         console.error("Error loading weights:", error);
      } finally {
         setLoading(false);
      }
   };

   const deleteWeight = async (weightId, token) => {
      try {
         // Mise à jour optimiste de l'UI
         setAllWeights((prevWeights) =>
            prevWeights.filter((weight) => weight.documentId !== weightId)
         );

         // Suppression dans Strapi
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/weights/${weightId}`,
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
            await loadAllWeights();
            throw new Error("Failed to delete weight");
         }
      } catch (error) {
         console.error("Error deleting weight:", error);
         throw error;
      }
   };

   const value = {
      allWeights,
      loading,
      deleteWeight,
      refreshWeights: loadAllWeights,
   };

   return (
      <WeightContext.Provider value={value}>{children}</WeightContext.Provider>
   );
}

export function useWeights() {
   const context = useContext(WeightContext);
   if (context === undefined) {
      throw new Error("useWeights must be used within a WeightProvider");
   }
   return context;
}

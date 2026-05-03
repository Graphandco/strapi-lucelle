"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { deleteWeight as deleteWeightAction } from "@/actions/deleteWeight";
import { getWeights } from "@/actions/getWeights";

const WeightContext = createContext();

export function WeightProvider({ children }) {
   const [allWeights, setAllWeights] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      loadAllWeights();
   }, []);

   const loadAllWeights = async () => {
      try {
         const data = await getWeights();
         setAllWeights(Array.isArray(data) ? data : []);
      } catch (error) {
         console.error("Error loading weights:", error);
      } finally {
         setLoading(false);
      }
   };

   const deleteWeight = async (weightId) => {
      try {
         setAllWeights((prevWeights) =>
            prevWeights.filter((weight) => weight.documentId !== weightId)
         );

         const result = await deleteWeightAction(weightId);
         if (!result?.success) {
            await loadAllWeights();
            throw new Error(result?.error || "Failed to delete weight");
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

"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ExerciceContext = createContext();

export function ExerciceProvider({ children }) {
   const [allExercices, setAllExercices] = useState([]);
   const [exerciceTypes, setExerciceTypes] = useState([]);
   const [allCourses, setAllCourses] = useState([]);
   const [loading, setLoading] = useState(true);

   // Charger les données au montage du composant
   useEffect(() => {
      loadAllExercices();
      loadAllExerciceTypes();
      loadAllCourses();
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

   const loadAllCourses = async () => {
      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/courses?populate=*&pagination[limit]=500`,
            {
               cache: "no-store",
            }
         );

         if (!response.ok) {
            throw new Error("Erreur lors de la récupération des courses");
         }

         const json = await response.json();
         const data = json.data || [];

         // Trier les courses par date (plus récent en premier)
         const sortedData = data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
         );
         setAllCourses(sortedData);
      } catch (error) {
         console.error("Error loading courses:", error);
      }
   };

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

   const deleteCourse = async (courseId, token) => {
      try {
         // Mise à jour optimiste de l'UI
         setAllCourses((prevCourses) =>
            prevCourses.filter((course) => course.id !== courseId)
         );

         // Suppression dans Strapi
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/courses/${courseId}`,
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
            await loadAllCourses();
            throw new Error("Failed to delete course");
         }
      } catch (error) {
         console.error("Error deleting course:", error);
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
      allCourses,
      loading,
      getUniqueCorps,
      getExercicesByType,
      getExerciceTypeById,
      deleteExercice,
      deleteCourse,
      // updateProductInCart,
      // updateProductToBuy,
      // updateProductQuantity,
      refreshExercices: loadAllExercices,
      refreshExerciceTypes: loadAllExerciceTypes,
      refreshCourses: loadAllCourses,
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

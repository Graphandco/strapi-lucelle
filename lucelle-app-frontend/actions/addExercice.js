"use server";

export async function addExercice(formData) {
   try {
      const series = formData.get("series");
      const repetitions = formData.get("repetitions");
      const poids = formData.get("poids");
      const date = formData.get("date");
      const typeId = formData.get("typeId");
      const token = formData.get("token");

      // Validation des champs requis
      if (!series || !repetitions || !date || !typeId || !token) {
         return {
            success: false,
            error: "Tous les champs sont requis",
         };
      }

      // Validation des valeurs numériques
      if (isNaN(parseInt(series)) || isNaN(parseInt(repetitions))) {
         return {
            success: false,
            error: "Les séries et répétitions doivent être des nombres",
         };
      }

      const response = await fetch(
         `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exercices`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               data: {
                  series: parseInt(series),
                  repetitions: parseInt(repetitions),
                  poids: poids ? parseFloat(poids) : null,
                  date: date,
                  types_d_exercice: typeId,
               },
            }),
         }
      );

      if (!response.ok) {
         const errorData = await response.json();
         console.error("API Error:", errorData);
         return {
            success: false,
            error: `Erreur ${response.status}: ${
               errorData.error?.message ||
               "Erreur lors de l'ajout de l'exercice"
            }`,
         };
      }

      const result = await response.json();
      return {
         success: true,
         data: result.data,
      };
   } catch (error) {
      console.error("Error adding exercice:", error);
      return {
         success: false,
         error: "Erreur lors de l'ajout de l'exercice",
      };
   }
}

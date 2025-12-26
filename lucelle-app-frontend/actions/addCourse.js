"use server";

export async function addCourse(formData) {
   try {
      const date = formData.get("date");
      const duree = formData.get("duree");
      const distance = formData.get("distance");
      const vitesse = formData.get("vitesse");
      const token = formData.get("token");

      // Validation du token
      if (!token) {
         return {
            success: false,
            error: "Token d'authentification manquant",
         };
      }

      // Validation de la date
      if (!date) {
         return {
            success: false,
            error: "La date est requise",
         };
      }

      const response = await fetch(
         `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/courses`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               data: {
                  date: date,
                  duree: duree || null,
                  distance: distance || null,
                  vitesse: vitesse || null,
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
               errorData.error?.message || "Erreur lors de l'ajout de la course"
            }`,
         };
      }

      const result = await response.json();
      return {
         success: true,
         data: result.data,
      };
   } catch (error) {
      console.error("Error adding course:", error);
      return {
         success: false,
         error: "Erreur lors de l'ajout de la course",
      };
   }
}

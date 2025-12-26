export async function addWeight(formData) {
   try {
      const poids = formData.get("poids");
      const date = formData.get("date");
      const token = formData.get("token");

      console.log("Données reçues:", {
         poids,
         date,
         token: token ? "présent" : "manquant",
      });

      if (!poids || !date || !token) {
         return {
            success: false,
            error: "Tous les champs sont requis",
         };
      }

      const response = await fetch(
         `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/weights`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               data: {
                  poids: parseFloat(poids),
                  date: date,
               },
            }),
         }
      );

      console.log("Statut de la réponse:", response.status);
      console.log(
         "Headers de la réponse:",
         Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         console.error("Erreur API:", errorData);
         throw new Error(
            errorData.error?.message ||
               `Erreur ${response.status}: ${response.statusText}`
         );
      }

      const result = await response.json();
      console.log("Résultat:", result);

      return {
         success: true,
         data: result.data,
      };
   } catch (error) {
      console.error("Erreur dans addWeight:", error);
      return {
         success: false,
         error: error.message || "Erreur lors de l'ajout de la mesure",
      };
   }
}

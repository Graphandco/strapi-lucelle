"use server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

// Fonction utilitaire pour les appels API
async function strapiRequest(endpoint, options = {}) {
   const url = `${STRAPI_URL}/api${endpoint}`;

   const config = {
      headers: {
         "Content-Type": "application/json",
         ...options.headers,
      },
      ...options,
   };

   try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.error?.message || "Une erreur est survenue");
      }

      return data;
   } catch (error) {
      console.error("Erreur API Strapi:", error);
      throw error;
   }
}

// Connexion
export async function login(identifier, password) {
   try {
      const data = await strapiRequest("/auth/local", {
         method: "POST",
         body: JSON.stringify({
            identifier, // email ou username
            password,
         }),
      });

      return {
         success: true,
         user: data.user,
         jwt: data.jwt,
      };
   } catch (error) {
      return {
         success: false,
         error: error.message,
      };
   }
}

// Récupérer l'utilisateur actuel
export async function getMe(jwt) {
   try {
      const data = await strapiRequest("/users/me", {
         headers: {
            Authorization: `Bearer ${jwt}`,
         },
      });

      return {
         success: true,
         user: data,
      };
   } catch (error) {
      return {
         success: false,
         error: error.message,
      };
   }
}

// Déconnexion (côté client uniquement)
export async function logout() {
   return {
      success: true,
      message: "Déconnexion réussie",
   };
}

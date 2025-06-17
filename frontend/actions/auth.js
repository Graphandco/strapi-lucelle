"use server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function login(identifier, password) {
   try {
      const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            identifier,
            password,
         }),
      });

      const data = await res.json();

      if (!res.ok) {
         throw new Error(data.error?.message || "Une erreur est survenue");
      }

      // Récupérer les données complètes de l'utilisateur avec les relations
      const userRes = await fetch(`${STRAPI_URL}/api/users/me?populate=*`, {
         headers: {
            Authorization: `Bearer ${data.jwt}`,
         },
      });

      if (!userRes.ok) {
         throw new Error(
            "Erreur lors de la récupération des données utilisateur"
         );
      }

      const userData = await userRes.json();

      // Combiner le JWT avec les données utilisateur complètes
      return {
         jwt: data.jwt,
         user: userData,
      };
   } catch (error) {
      throw new Error(error.message);
   }
}

export async function register(username, email, password) {
   try {
      const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            username,
            email,
            password,
         }),
      });

      const data = await res.json();

      if (!res.ok) {
         throw new Error(data.error?.message || "Une erreur est survenue");
      }

      // Récupérer les données complètes de l'utilisateur avec les relations
      const userRes = await fetch(`${STRAPI_URL}/api/users/me?populate=*`, {
         headers: {
            Authorization: `Bearer ${data.jwt}`,
         },
      });

      if (!userRes.ok) {
         throw new Error(
            "Erreur lors de la récupération des données utilisateur"
         );
      }

      const userData = await userRes.json();

      // Combiner le JWT avec les données utilisateur complètes
      return {
         jwt: data.jwt,
         user: userData,
      };
   } catch (error) {
      throw new Error(error.message);
   }
}

export async function logout() {
   return { success: true };
}

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

      return data;
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

      return data;
   } catch (error) {
      throw new Error(error.message);
   }
}

export async function logout() {
   return { success: true };
}

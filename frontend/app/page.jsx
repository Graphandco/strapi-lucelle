"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
   const { user } = useAuth();
   console.log(user);
   return (
      <div className="wrapper py-20">
         <h1 className="text-4xl font-bold mb-8">
            Bienvenue sur Next-Strapi Auth
         </h1>
         <p className="text-lg text-gray-600">
            Un exemple d'authentification avec Next.js et Strapi
         </p>
      </div>
   );
}

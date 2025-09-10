"use client";

import { useAuth } from "@/contexts/AuthContext";
import { login } from "@/actions/auth";

export default function AuthTest() {
   const { user, loading } = useAuth();

   const testLogin = async () => {
      try {
         console.log("Test de connexion...");
         const result = await login("test@example.com", "password123");
         console.log("Résultat:", result);
      } catch (error) {
         console.error("Erreur de test:", error);
      }
   };

   if (loading) {
      return <div>Chargement...</div>;
   }

   return (
      <div className="p-4 border rounded">
         <h3>Test d'authentification</h3>
         <p>Utilisateur: {user ? "Connecté" : "Non connecté"}</p>
         <button onClick={testLogin} className="px-4 py-2 bg-blue-500 text-white rounded">
            Tester la connexion
         </button>
      </div>
   );
}

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { mapSupabaseUser } from "@/lib/auth/map-user";

export default function AuthTest() {
   const { user, isLoading, login: loginUser } = useAuth();

   const testLogin = async () => {
      try {
         console.log("Test de connexion...");
         const supabase = createClient();
         const { data, error } = await supabase.auth.signInWithPassword({
            email: "test@example.com",
            password: "password123",
         });
         if (error) {
            console.error("Erreur:", error.message);
            return;
         }
         loginUser(mapSupabaseUser(data.user));
         console.log("Résultat:", data.user);
      } catch (error) {
         console.error("Erreur de test:", error);
      }
   };

   if (isLoading) {
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

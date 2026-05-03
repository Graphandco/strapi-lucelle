"use server";

import { mapSupabaseUser } from "@/lib/auth/map-user";
import { createClient } from "@/lib/supabase/server";

export async function getMe() {
   try {
      const supabase = await createClient();
      const {
         data: { user },
         error,
      } = await supabase.auth.getUser();

      if (error || !user) {
         return {
            success: false,
            error: error?.message || "Non authentifié",
         };
      }

      return {
         success: true,
         user: mapSupabaseUser(user),
      };
   } catch (error) {
      return {
         success: false,
         error: error.message,
      };
   }
}

export async function logout() {
   try {
      const supabase = await createClient();
      await supabase.auth.signOut();
      return {
         success: true,
         message: "Déconnexion réussie",
      };
   } catch (error) {
      return {
         success: false,
         error: error.message,
      };
   }
}

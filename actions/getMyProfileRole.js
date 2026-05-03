"use server";

import { createClient } from "@/lib/supabase/server";

/** Lit `profiles.role` (schéma public ou `shopping_list`, clé `id` ou `user_id`). */
async function readProfileRole(supabase, userId) {
   if (!userId) return null;

   const onlySchema = process.env.SUPABASE_PROFILES_SCHEMA?.trim() || null;
   const schemas = onlySchema ? [onlySchema] : [null, "shopping_list"];
   const cols = ["id", "user_id"];

   for (const schema of schemas) {
      for (const col of cols) {
         const builder = schema
            ? supabase.schema(schema).from("profiles")
            : supabase.from("profiles");

         const { data, error } = await builder
            .select("role")
            .eq(col, userId)
            .maybeSingle();

         if (error) {
            const msg = error.message || "";
            if (
               msg.includes("column") ||
               msg.includes("does not exist") ||
               msg.includes("schema") ||
               error.code === "PGRST204" ||
               error.code === "42P01"
            ) {
               continue;
            }
            console.warn(
               "getMyProfileRole:",
               schema ?? "public",
               col,
               error.message,
            );
            continue;
         }

         if (data?.role != null && String(data.role).trim() !== "") {
            return String(data.role);
         }
      }
   }

   return null;
}

/** Rôle métier de l’utilisateur connecté (table `profiles`). Dashboard uniquement. */
export async function getMyProfileRole() {
   try {
      const supabase = await createClient();
      const {
         data: { user },
         error,
      } = await supabase.auth.getUser();

      if (error || !user) {
         return { role: null };
      }

      const role = await readProfileRole(supabase, user.id);
      return { role };
   } catch (e) {
      console.error("getMyProfileRole:", e);
      return { role: null };
   }
}

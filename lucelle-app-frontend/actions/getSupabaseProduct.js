"use server";

import { supabase } from "@/supabase-client";

export async function getSupabaseProducts() {
   const { data, error } = await supabase
      .schema("shopping_list")
      .from("products")
      .select(
         `
         id,
         name,
         category_id,
         category:categories (
            name
         )
      `,
      )
      .order("name", { ascending: true });

   if (error) {
      console.error("Error reading products:", error.message);
      throw new Error(error.message);
   }

   return data ?? [];
}

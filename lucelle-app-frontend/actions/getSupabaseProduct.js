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
         image_url,
         category:categories (
            id,
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

export async function getSupabaseCategories() {
   const { data, error } = await supabase
      .schema("shopping_list")
      .from("categories")
      .select("id, name")
      .order("name", { ascending: true });

   if (error) {
      console.error("Error reading categories:", error.message);
      throw new Error(error.message);
   }

   return data ?? [];
}

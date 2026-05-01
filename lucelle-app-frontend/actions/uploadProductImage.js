"use server";

import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

const BUCKET = "shopping_list";
const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
   "image/jpeg",
   "image/png",
   "image/gif",
   "image/webp",
   "image/avif",
   "",
]);

function extensionFromMime(type, fallbackName) {
   const map = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/avif": "avif",
   };
   if (type && map[type]) return map[type];
   const ext = fallbackName.split(".").pop()?.toLowerCase();
   if (ext && ["jpg", "jpeg", "png", "gif", "webp", "avif"].includes(ext)) {
      return ext === "jpeg" ? "jpg" : ext;
   }
   return "jpg";
}

/**
 * Envoie une image dans le bucket Storage `shopping_list`.
 * @param {File} file
 * @returns {Promise<{ success: boolean, url?: string | null, path?: string, error?: string }>}
 */
export async function uploadProductImageFile(file) {
   if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: "Aucune image valide.", url: null };
   }

   if (file.size > MAX_BYTES) {
      return {
         success: false,
         error: "Image trop volumineuse (max 5 Mo).",
         url: null,
      };
   }

   if (file.type && !ALLOWED_TYPES.has(file.type)) {
      return { success: false, error: "Format d’image non supporté.", url: null };
   }

   try {
      const supabase = await createClient();
      const {
         data: { user },
         error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
         return {
            success: false,
            error: "Tu dois être connecté pour envoyer une image.",
            url: null,
         };
      }

      const ext = extensionFromMime(file.type, file.name);
      const path = `${user.id}/${Date.now()}-${randomUUID()}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: upErr } = await supabase.storage
         .from(BUCKET)
         .upload(path, buffer, {
            contentType: file.type || `image/${ext}`,
            upsert: false,
         });

      if (upErr) {
         console.error("uploadProductImage:", upErr.message);
         return { success: false, error: upErr.message, url: null };
      }

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return { success: true, url: pub.publicUrl, path };
   } catch (e) {
      console.error("uploadProductImage:", e);
      return {
         success: false,
         error: e?.message || "Échec de l’envoi de l’image.",
         url: null,
      };
   }
}

/**
 * Server action : FormData avec le champ fichier `image` (comme le formulaire produit).
 */
export async function uploadProductImage(formData) {
   const file = formData.get("image");
   return uploadProductImageFile(file);
}

/** Pour addProduct : pas d’upload si champ vide ou absent. */
export async function tryUploadProductImageField(fieldValue) {
   if (!(fieldValue instanceof File) || fieldValue.size === 0) {
      return { success: true, url: null };
   }
   return uploadProductImageFile(fieldValue);
}

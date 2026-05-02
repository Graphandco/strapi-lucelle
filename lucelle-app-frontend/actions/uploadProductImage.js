"use server";

import { createClient } from "@/lib/supabase/server";

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

/** Nom de fichier sans extension (dernier segment de chemin). */
function baseNameWithoutExt(name) {
   const base = String(name || "").replace(/^.*[/\\]/, "");
   const i = base.lastIndexOf(".");
   return i > 0 ? base.slice(0, i) : base || "image";
}

/**
 * Base sûre pour une clé Storage : ASCII, pas de slash, longueur bornée.
 * @param {string} raw
 * @param {number} [maxLen]
 */
function sanitizeStorageBase(raw, maxLen = 80) {
   let s = baseNameWithoutExt(raw)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, maxLen);
   if (!s) s = "image";
   return s;
}

/** Date au format jour-mois-année (JJ-MM-AAAA), calendrier local du serveur. */
function formatDateDmy(d = new Date()) {
   const y = d.getFullYear();
   const m = String(d.getMonth() + 1).padStart(2, "0");
   const day = String(d.getDate()).padStart(2, "0");
   return `${day}-${m}-${y}`;
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
      const base = sanitizeStorageBase(file.name);
      const path = `${base}-${formatDateDmy()}-${user.id}.${ext}`;
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

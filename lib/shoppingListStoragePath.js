/**
 * Extrait la clé objet (chemin dans le bucket) depuis une URL publique / signée Supabase Storage,
 * pour le bucket `shopping_list`.
 *
 * @param {string | null | undefined} imageUrl
 * @param {string} [bucket]
 * @returns {string | null}
 */
export function shoppingListObjectPathFromImageUrl(imageUrl, bucket = "shopping_list") {
   if (!imageUrl || typeof imageUrl !== "string") return null;

   const trimmed = imageUrl.trim().replace(/^['"]|['"]$/g, "");

   // Déjà une clé relative au bucket (sans schéma URL)
   if (!/^https?:\/\//i.test(trimmed)) {
      const noLead = trimmed.replace(/^\/+/, "");
      if (noLead.startsWith(`${bucket}/`)) {
         return noLead.slice(bucket.length + 1).replace(/\/+$/, "") || null;
      }
      if (noLead && !noLead.includes("://")) {
         return noLead.replace(/\/+$/, "") || null;
      }
      return null;
   }

   let pathname;
   try {
      pathname = new URL(trimmed).pathname;
   } catch {
      return null;
   }

   let decoded = pathname;
   try {
      decoded = decodeURIComponent(pathname);
   } catch {
      /* garder pathname brut */
   }

   const markers = [
      `/storage/v1/object/public/${bucket}/`,
      `/object/public/${bucket}/`,
      `/storage/v1/render/image/public/${bucket}/`,
      `/render/image/public/${bucket}/`,
      `/storage/v1/object/sign/${bucket}/`,
      `/object/sign/${bucket}/`,
   ];

   for (const pathVariant of [decoded, pathname]) {
      for (const marker of markers) {
         const idx = pathVariant.indexOf(marker);
         if (idx === -1) continue;
         let rest = pathVariant.slice(idx + marker.length);
         rest = rest.split("?")[0];
         rest = rest.replace(/\/+$/, "");
         if (rest) return rest;
      }
   }

   // Fallback : chemins classiques (public, sign, render)
   const patterns = [
      new RegExp(`/(?:storage/v1/)?object/(?:public|sign)/${bucket}/(.+)$`, "i"),
      new RegExp(`/(?:storage/v1/)?render/image/public/${bucket}/(.+)$`, "i"),
   ];
   for (const re of patterns) {
      const m = decoded.match(re) || pathname.match(re);
      if (m?.[1]) {
         const rest = m[1].split("?")[0].replace(/\/+$/, "");
         if (rest) return rest;
      }
   }

   return null;
}

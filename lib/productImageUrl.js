/**
 * URL affichable pour la vignette produit (Supabase Storage ou chemin absolu).
 * @param {{ imageUrl?: string | null }} product
 * @returns {string | null}
 */
export function resolveProductImageUrl(product) {
   const raw =
      typeof product?.imageUrl === "string" ? product.imageUrl.trim() : "";
   if (
      raw &&
      (raw.startsWith("http://") ||
         raw.startsWith("https://") ||
         raw.startsWith("/"))
   ) {
      return raw;
   }
   return null;
}

/**
 * URL d’avatar Gravatar (SHA-256 de l’email en hex, minuscules, trim).
 * @see https://docs.gravatar.com/avatars/
 * @see https://docs.gravatar.com/general/hash/
 *
 * @param {string} email
 * @param {{ size?: number, defaultImage?: string }} [opts]
 * @returns {Promise<string | null>}
 */
export async function gravatarUrlFromEmail(email, opts = {}) {
   if (!email || typeof email !== "string") return null;

   const normalized = email.trim().toLowerCase();
   if (!normalized) return null;

   const size = opts.size ?? 200;
   const defaultImage = opts.defaultImage ?? "identicon";

   const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(normalized),
   );
   const hash = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

   const q = new URLSearchParams({ s: String(size) });
   if (defaultImage) q.set("d", defaultImage);

   return `https://www.gravatar.com/avatar/${hash}?${q}`;
}

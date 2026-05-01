/** Normalise un User Supabase pour l’UI (compatibilité avec l’ancien shape Payload). */
export function mapSupabaseUser(user) {
   if (!user) return null;

   const meta = user.user_metadata || {};
   const username =
      meta.display_name ||
      meta.username ||
      meta.full_name ||
      (user.email ? user.email.split("@")[0] : null) ||
      "Utilisateur";

   return {
      id: user.id,
      email: user.email,
      username,
      supabaseUser: user,
   };
}

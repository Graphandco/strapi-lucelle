"use client";

import { useState } from "react";
import { Heart, HeartPlus } from "lucide-react";
import { toast } from "sonner";
import { setFavorite } from "@/actions/favorites";

export default function SupabaseProductRow({ product, initialFavorite }) {
   const [favorited, setFavorited] = useState(initialFavorite);
   const [pending, setPending] = useState(false);

   const handleToggle = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setPending(true);
      try {
         const { favorited: next } = await setFavorite(product.id);
         setFavorited(next);
      } catch (err) {
         toast.error(err.message ?? "Impossible de mettre à jour le favori");
      } finally {
         setPending(false);
      }
   };

   return (
      <li className="flex items-center justify-between gap-3 py-2 not-last:border-b border-white/10">
         <div className="flex min-w-0 flex-1 items-center gap-2 text-white text-sm">
            <span className="truncate">{product.name}</span>
            {product.category?.name != null && (
               <span className="shrink-0 text-white/60">
                  — {product.category.name}
               </span>
            )}
         </div>
         <button
            type="button"
            onClick={handleToggle}
            disabled={pending}
            className="shrink-0 rounded-md p-1.5 text-primary hover:bg-white/10 disabled:opacity-50"
            title={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
            aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
            aria-pressed={favorited}
         >
            {favorited ? (
               <Heart className="size-5 fill-primary text-primary" />
            ) : (
               <HeartPlus className="size-5" />
            )}
         </button>
      </li>
   );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { addProduct } from "@/actions/addProduct";
import { getSupabaseCategories } from "@/actions/getSupabaseProduct";

export default function AddProductForm() {
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [categories, setCategories] = useState([]);

   useEffect(() => {
      let cancelled = false;
      (async () => {
         try {
            const data = await getSupabaseCategories();
            if (!cancelled) {
               setCategories(
                  [...(data ?? [])].map((c) => ({ ...c, id: String(c.id) })),
               );
            }
         } catch (e) {
            console.error(e);
         }
      })();
      return () => {
         cancelled = true;
      };
   }, []);

   async function handleSubmit(event) {
      event.preventDefault();
      setLoading(true);
      setError(null);

      const formData = new FormData(event.target);

      try {
         const result = await addProduct(formData);

         if (!result.success) {
            throw new Error(
               result.error || "Erreur lors de l'ajout du produit",
            );
         }

         router.push("/shopping-list");
      } catch (error) {
         console.error("Erreur détaillée:", error);
         setError(error.message);
      } finally {
         setLoading(false);
      }
   }

   return (
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
         <div>
            <input
               type="text"
               id="name"
               name="name"
               required
               placeholder="Nom du produit"
               className="bg-card outline-none border-none rounded-lg w-full p-4 placeholder:text-white placeholder:text-sm"
            />
         </div>

         <div>
            <select
               id="category"
               name="category"
               required
               className="bg-card outline-none border-none rounded-lg w-full p-4 text-white text-sm"
            >
               <option value="" className="text-white text-sm">
                  Sélectionner une catégorie
               </option>
               {categories.map((category) => (
                  <option
                     key={category.id}
                     value={category.id}
                     className="text-white text-sm"
                  >
                     {category.name}
                  </option>
               ))}
            </select>
         </div>

         {error && <div className="text-red-500 text-sm">{error}</div>}

         <button
            type="submit"
            disabled={loading}
            className="w-full font-normal bg-primary text-black py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
         >
            {loading ? "Ajout en cours..." : "Ajouter"}
         </button>
      </form>
   );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { addProduct } from "@/actions/addProduct";
import { getSupabaseCategories } from "@/actions/getSupabaseProduct";
import { toast } from "sonner";

export default function AddProductForm() {
   const formRef = useRef(null);
   const nameInputRef = useRef(null);
   const imageInputRef = useRef(null);
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
      const form = formRef.current;
      if (!form) return;

      setLoading(true);
      setError(null);

      const formData = new FormData(form);

      try {
         const result = await addProduct(formData);

         if (!result.success) {
            throw new Error(
               result.error || "Erreur lors de l'ajout du produit",
            );
         }

         if (nameInputRef.current) {
            nameInputRef.current.value = "";
         }
         if (imageInputRef.current) {
            imageInputRef.current.value = "";
         }
         toast.success("Produit ajouté avec succès");

         //router.push("/shopping-list");
      } catch (error) {
         console.error("Erreur détaillée:", error);
         setError(error.message);
      } finally {
         setLoading(false);
      }
   }

   return (
      <form
         ref={formRef}
         onSubmit={handleSubmit}
         className="max-w-md space-y-4"
      >
         <div>
            <input
               ref={nameInputRef}
               type="text"
               id="name"
               name="name"
               required
               placeholder="Nom du produit"
               className="bg-card outline-none border-none rounded-lg w-full p-4 placeholder:text-white placeholder:text-sm"
            />
         </div>

         <div>
            <label
               htmlFor="image"
               className="block text-white/70 text-sm mb-2"
            >
               Photo (optionnel)
            </label>
            <input
               ref={imageInputRef}
               id="image"
               name="image"
               type="file"
               accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
               className="block w-full text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-black file:font-normal"
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

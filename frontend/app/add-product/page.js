"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addProduct } from "@/actions/addProduct";

// export const metadata = {
//    title: "Ajouter un produit | Graph and Shop",
// };

export default function AddProduct() {
   const { user } = useAuth();
   const { refreshProducts, categories } = useProducts();
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   async function handleSubmit(event) {
      event.preventDefault();
      setLoading(true);
      setError(null);

      const formData = new FormData(event.target);
      formData.append("token", user.jwt);

      try {
         const result = await addProduct(formData);

         if (!result.success) {
            throw new Error(
               result.error || "Erreur lors de l'ajout du produit"
            );
         }

         // Recharger tous les produits
         await refreshProducts();

         // Rediriger vers la liste de courses
         router.push("/shopping-list");
      } catch (error) {
         console.error("Erreur détaillée:", error);
         setError(error.message);
      } finally {
         setLoading(false);
      }
   }

   return (
      <div className="">
         <h1 className="text-2xl mb-5 px-1 text-primary/50 flex items-center gap-2">
            Ajouter un produit
         </h1>
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

            {/* <div>
               <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="0"
                  step="1"
                  defaultValue="1"
                  required
                  placeholder="Quantité"
                  className="bg-card outline-none border-none rounded-lg w-full py-2 px-4 placeholder:text-white placeholder:text-sm"
               />
            </div> */}

            {/* <div className="flex items-center space-x-4">
               <div className="flex items-center">
                  <input
                     type="checkbox"
                     id="isInCart"
                     name="isInCart"
                     value="true"
                     className="mr-2"
                  />
                  <label htmlFor="isInCart">Dans le panier</label>
               </div>

               <div className="flex items-center">
                  <input
                     type="checkbox"
                     id="isToBuy"
                     name="isToBuy"
                     value="true"
                     className="mr-2"
                  />
                  <label htmlFor="isToBuy">À acheter</label>
               </div>
            </div> */}

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
               type="submit"
               disabled={loading}
               className="w-full bg-primary text-black py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
               {loading ? "Ajout en cours..." : "Ajouter"}
            </button>
         </form>
      </div>
   );
}

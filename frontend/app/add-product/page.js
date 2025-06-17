"use client";

import { useRouter } from "next/navigation";
import { getCategories } from "@/actions/categories";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";

export default function AddProduct() {
   const router = useRouter();
   const { user } = useAuth();
   const { refreshProducts } = useProducts();
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const [categories, setCategories] = useState([]);

   useEffect(() => {
      const fetchCategories = async () => {
         const data = await getCategories();
         setCategories(data);
      };
      fetchCategories();
   }, []);

   async function handleSubmit(event) {
      event.preventDefault();
      setLoading(true);
      setError("");

      const formData = new FormData(event.target);
      formData.append("token", user.jwt);

      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.jwt}`,
               },
               body: JSON.stringify({
                  data: {
                     name: formData.get("name"),
                     quantity: parseFloat(formData.get("quantity")),
                     // isInCart: formData.get("isInCart") === "true",
                     // isToBuy: formData.get("isToBuy") === "true",
                     isInCart: false,
                     isToBuy: true,
                     category: parseInt(formData.get("category")),
                  },
               }),
            }
         );

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
               errorData.error?.message || "Erreur lors de l'ajout du produit"
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
         <h1 className="text-2xl mb-3 px-1 text-primary/50 flex items-center gap-2">
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
                  className="bg-card outline-none border-none rounded-lg w-full py-2 px-4 placeholder:text-white placeholder:text-sm"
               />
            </div>

            <div>
               <select
                  id="category"
                  name="category"
                  required
                  className="bg-card outline-none border-none rounded-lg w-full py-2 px-4 text-white text-sm"
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

            <div>
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
            </div>

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
               className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90"
            >
               {loading ? "Ajout en cours..." : "Ajouter le produit"}
            </button>
         </form>
      </div>
   );
}

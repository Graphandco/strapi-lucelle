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
      <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4">Ajouter un produit</h1>

         <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            <div>
               <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nom du produit
               </label>
               <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full p-2 border rounded"
               />
            </div>

            <div>
               <label
                  htmlFor="category"
                  className="block text-sm font-medium mb-1"
               >
                  Catégorie
               </label>
               <select
                  id="category"
                  name="category"
                  required
                  className="w-full p-2 border rounded"
               >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                     <option key={category.id} value={category.id}>
                        {category.name}
                     </option>
                  ))}
               </select>
            </div>

            <div>
               <label
                  htmlFor="quantity"
                  className="block text-sm font-medium mb-1"
               >
                  Quantité
               </label>
               <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="0"
                  step="1"
                  defaultValue="1"
                  required
                  className="w-full p-2 border rounded"
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
               disabled={loading}
               className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
               {loading ? "Ajout en cours..." : "Ajouter le produit"}
            </button>
         </form>
      </div>
   );
}

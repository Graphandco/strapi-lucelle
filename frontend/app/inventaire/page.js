"use client";

import { useEffect, useState } from "react";
import { getStrapiProductsNotToBuy } from "@/actions/getProducts";
import { deleteProduct } from "@/actions/deleteProduct";
import { useAuth } from "@/contexts/AuthContext";
import { Trash } from "lucide-react";

export default function Inventaire() {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const { user } = useAuth();

   useEffect(() => {
      async function fetchProducts() {
         const data = await getStrapiProductsNotToBuy("products");
         setProducts(
            data.map((p) => (p.attributes ? { id: p.id, ...p.attributes } : p))
         );
         setLoading(false);
         console.log(data);
      }
      fetchProducts();
   }, []);

   async function handleDelete(documentId) {
      if (!user?.jwt) return;
      const res = await deleteProduct(documentId, user.jwt);
      if (res.success) {
         setProducts(products.filter((p) => p.documentId !== documentId));
      } else {
         alert(res.error || "Erreur lors de la suppression");
      }
   }

   return (
      <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4">Inventaire (à acheter)</h1>
         {loading ? (
            <div>Chargement...</div>
         ) : (
            <ul className=" rounded-lg shadow p-4 space-y-2">
               {products.length > 0 ? (
                  products.map((product) => (
                     <li
                        key={product.id}
                        className="flex items-center justify-between border-b last:border-b-0 py-2"
                     >
                        <span>
                           {product.name}
                           <span className="">x{product.quantity}</span>
                        </span>
                        <span>{product.id}</span>
                        <button
                           onClick={() => handleDelete(product.documentId)}
                           className="text-red-500 hover:text-red-700 p-1"
                           title="Supprimer"
                        >
                           <Trash size={20} />
                        </button>
                     </li>
                  ))
               ) : (
                  <li className="text-gray-400">Aucun produit à acheter.</li>
               )}
            </ul>
         )}
      </div>
   );
}

"use client";
import { useEffect, useState } from "react";
import { useCatalogData } from "@/hooks/useCatalogData";
import { Trash } from "lucide-react";
import ConfirmAlert from "@/components/ConfirmAlert";
import DashboardSummary from "./DashboardSummary";
import { deleteProduct } from "@/actions/deleteProduct";
import { getMyProfileRole } from "@/actions/getMyProfileRole";

export default function DashboardProducts() {
   const [isAdmin, setIsAdmin] = useState(false);

   useEffect(() => {
      let cancelled = false;
      getMyProfileRole().then(({ role }) => {
         if (!cancelled) setIsAdmin(role === "admin");
      });
      return () => {
         cancelled = true;
      };
   }, []);

   const {
      products: allProducts,
      categories,
      loading,
      reload,
   } = useCatalogData();
   const productsToBuy = allProducts.filter((product) => product.isToBuy);
   const productsInCart = allProducts.filter((product) => product.isInCart);

   const handleDeleteProduct = async (productId) => {
      const response = await deleteProduct(productId);
      if (!response?.success) {
         throw new Error(
            response?.error || "Échec de la suppression du produit",
         );
      }
      await reload({ silent: true });
   };

   if (loading) {
      return <div className="text-white">Chargement...</div>;
   }

   return (
      <>
         <DashboardSummary
            allProducts={allProducts}
            productsToBuy={productsToBuy}
            productsInCart={productsInCart}
         />
         {isAdmin && (
            <div className="bg-card rounded-lg mt-10 p-3 w-full space-y-3">
               {categories.map((category) => {
                  const productsInCategory = allProducts.filter(
                     (product) => product.category?.id === category.id,
                  );

                  if (productsInCategory.length === 0) return null;

                  return (
                     <div key={category.id} className="mb-6">
                        <h3 className="text-lg text-white font-medium mb-2">
                           {category.name}{" "}
                           <span className="text-primary/50 text-base">
                              ({productsInCategory.length})
                           </span>
                        </h3>
                        <ul className="rounded-lg px-3 pb-2 space-y-1">
                           {productsInCategory.map((product) => (
                              <div
                                 key={product.documentId}
                                 className="flex items-center justify-between pb-1 not-last:border-b border-white/10"
                              >
                                 <p className="font-light text-sm">
                                    {product.name}
                                 </p>

                                 <ConfirmAlert
                                    title={`Supprimer le produit ${product.name} ?`}
                                    description="Cette action est irréversible."
                                    action={() =>
                                       handleDeleteProduct(product.documentId)
                                    }
                                    notif={`${product.name} a bien été supprimé`}
                                 >
                                    <Trash
                                       size={15}
                                       className="text-red-400 cursor-pointer hover:text-red-300 transition-colors"
                                    />
                                 </ConfirmAlert>
                              </div>
                           ))}
                        </ul>
                     </div>
                  );
               })}
            </div>
         )}
      </>
   );
}

"use client";

import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProducts } from "@/contexts/ProductContext";
import { getCategories } from "@/actions/categories";
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DashboardPage() {
   const { user, logout } = useAuth();
   const router = useRouter();
   const { allProducts, deleteProduct } = useProducts();
   const productsToBuy = allProducts.filter((product) => product.isToBuy);
   const productsInCart = allProducts.filter((product) => product.isInCart);
   const [categories, setCategories] = useState([]);

   useEffect(() => {
      const loadCategories = async () => {
         const data = await getCategories();
         setCategories(data);
      };
      loadCategories();
   }, []);

   const avatarUrl = user?.user?.avatar?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${user.user.avatar.url}`
      : null;

   const handleLogout = () => {
      logout();
      router.push("/"); // Redirection vers la page d'accueil
   };

   const handleDeleteProduct = async (productId, productName) => {
      if (!user?.jwt) return;

      try {
         await deleteProduct(productId, user.jwt);
         toast.success(`${productName} a bien été supprimé`);
      } catch (error) {
         console.error("Erreur lors de la suppression:", error);
         toast.error("Erreur lors de la suppression du produit");
      }
   };

   return (
      <div className="flex flex-col items-center">
         <h1 className="text-2xl mb-5 px-1 text-primary/50 flex items-center gap-2">
            Tableau de bord
         </h1>
         {avatarUrl && (
            <Image
               src={avatarUrl}
               alt="Avatar utilisateur"
               width={100}
               height={100}
               className="rounded-full aspect-square object-cover"
               priority
            />
         )}
         <div className="">
            <p className="mb-4">Bienvenue {user?.user?.username} !</p>

            <button
               onClick={handleLogout}
               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
               Déconnexion
            </button>
         </div>
         <div className="bg-card rounded-lg mt-10 p-3 w-full space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
               <p>Total produits</p>
               <p className="text-primary/50">{allProducts.length}</p>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
               <p>Produits à acheter</p>
               <p className="text-primary/50">{productsToBuy.length}</p>
            </div>
            <div className="flex items-center justify-between">
               <p>Produits dans le panier</p>
               <p className="text-primary/50">{productsInCart.length}</p>
            </div>
         </div>
         <div className="bg-card rounded-lg mt-10 p-3 w-full space-y-3">
            {categories.map((category) => {
               const productsInCategory = allProducts.filter(
                  (product) => product.category?.id === category.id
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
                     <ul className="bg-card rounded-lg px-3 pb-2 space-y-1">
                        {productsInCategory.map((product) => (
                           <div
                              key={product.documentId}
                              className="flex items-center justify-between pb-1 not-last:border-b border-white/10"
                           >
                              <p className="font-light text-sm">
                                 {product.name}
                              </p>

                              <AlertDialog>
                                 <AlertDialogTrigger asChild>
                                    <Trash
                                       size={15}
                                       className="text-red-400 cursor-pointer hover:text-red-300 transition-colors"
                                    />
                                 </AlertDialogTrigger>
                                 <AlertDialogContent>
                                    <AlertDialogHeader>
                                       <AlertDialogTitle>
                                          Supprimer le produit {product.name} ?
                                       </AlertDialogTitle>
                                       <AlertDialogDescription>
                                          Cette action est irréversible.
                                       </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                       <AlertDialogCancel>
                                          Annuler
                                       </AlertDialogCancel>
                                       <AlertDialogAction
                                          onClick={() =>
                                             handleDeleteProduct(
                                                product.documentId,
                                                product.name
                                             )
                                          }
                                       >
                                          Supprimer
                                       </AlertDialogAction>
                                    </AlertDialogFooter>
                                 </AlertDialogContent>
                              </AlertDialog>
                           </div>
                        ))}
                     </ul>
                  </div>
               );
            })}
         </div>
      </div>
   );
}

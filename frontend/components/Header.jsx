"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
   const { user } = useAuth();

   return (
      <header className="shadow-sm">
         <div className="wrapper py-4">
            <nav className="flex items-center justify-between">
               <Link href="/" className="text-xl font-bold">
                  Next-Strapi Auth
               </Link>

               <div className="flex items-center gap-4">
                  {user ? (
                     <>
                        <Link
                           href="/dashboard"
                           className="text-gray-600 hover:text-gray-900"
                        >
                           Dashboard
                        </Link>
                        <Link
                           href="/shopping-list"
                           className="text-gray-600 hover:text-gray-900"
                        >
                           Shopping List
                        </Link>
                        <Link
                           href="/add-product"
                           className="text-gray-600 hover:text-gray-900"
                        >
                           Ajouter un produit
                        </Link>
                        <Link
                           href="/inventaire"
                           className="text-gray-600 hover:text-gray-900"
                        >
                           Inventaire
                        </Link>
                     </>
                  ) : (
                     <Link
                        href="/login"
                        className="text-gray-600 hover:text-gray-900"
                     >
                        Connexion
                     </Link>
                  )}
               </div>
            </nav>
         </div>
      </header>
   );
}

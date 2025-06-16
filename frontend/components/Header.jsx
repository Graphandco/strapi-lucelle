"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
   const { user } = useAuth();

   return (
      <header className="shadow-sm">
         <div className="container py-4">
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

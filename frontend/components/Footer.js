"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, Plus, Package } from "lucide-react";

export default function Footer() {
   const { user } = useAuth();

   if (!user) return null;

   return (
      <footer className="fixed z-10 bottom-0 left-0 w-full bg-card py-4 px-6">
         <div className=" mx-auto flex justify-between items-center">
            <Link
               href="/shopping-list"
               className="p-2 hover:bg-card/80 rounded-full transition-colors"
            >
               <ShoppingCart className="w-6 h-6 text-white" />
            </Link>

            <Link
               href="/add-product"
               className="p-2 hover:bg-card/80 rounded-full transition-colors"
            >
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-card" />
               </div>
            </Link>

            <Link
               href="/inventaire"
               className="p-2 hover:bg-card/80 rounded-full transition-colors"
            >
               <Package className="w-6 h-6 text-white" />
            </Link>
         </div>
      </footer>
   );
}

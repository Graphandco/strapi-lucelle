"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, Plus, Package } from "lucide-react";

export default function Footer() {
   const { user } = useAuth();

   if (!user) return null;

   return (
      <footer className="fixed z-10 bottom-0 left-0 w-full bg-card px-6">
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
               <div className="relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card  rounded-full w-32 aspect-square " />

                  <Plus size={25} className="z-10" />
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

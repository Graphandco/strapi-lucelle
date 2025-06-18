"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, Store, CirclePlus, CircleUser } from "lucide-react";

export default function Footer() {
   const { user } = useAuth();

   if (!user) return null;

   return (
      <footer className="fixed z-10 bottom-0 left-0 w-full bg-black p-3">
         <div className=" mx-auto flex justify-around items-center">
            <Link
               href="/shopping-list"
               className="flex flex-col items-center gap-1 px-2"
            >
               <ShoppingCart className="w-6 h-6 text-white" />
               <span className="text-white text-[10px]">Panier</span>
            </Link>
            <Link
               href="/add-product"
               className="flex flex-col items-center gap-1 px-2"
            >
               <CirclePlus size={25} className="z-10" />
               <span className="text-white text-[10px]">Ajouter</span>
            </Link>
            <Link
               href="/inventaire"
               className="flex flex-col items-center gap-1 px-2"
            >
               <Store className="w-6 h-6 text-white" />
               <span className="text-white text-[10px]">Inventaire</span>
            </Link>
            {/* <Link
               href="/dashboard"
               className="flex flex-col items-center gap-1 px-2"
            >
               <CircleUser className="w-6 h-6 text-white" />
               <span className="text-white text-[10px]">Dashboard</span>
            </Link> */}
         </div>
      </footer>
   );
}

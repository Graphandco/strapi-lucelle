"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, Store, CirclePlus, Home } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
   const { user } = useAuth();
   const pathname = usePathname();
   if (!user) return null;

   return (
      <footer className="fixed z-10 bottom-0 left-0 w-full bg-headerfooter pt-3 pb-2">
         <div className=" mx-auto grid grid-cols-4 items-center justify-center">
            <Link
               href="/"
               className={`flex flex-col items-center px-2 border-r border-white/10 ${
                  pathname === "/" ? "text-primary" : "text-white"
               }`}
            >
               <Home size={22} className="" />
               <span className="text-[12px]">Accueil</span>
            </Link>
            <Link
               href="/shopping-list"
               className={`flex flex-col items-center px-2 border-r border-white/10 ${
                  pathname === "/shopping-list" ? "text-primary" : "text-white"
               }`}
            >
               <ShoppingCart size={22} className="" />
               <span className="text-[12px]">Panier</span>
            </Link>
            <Link
               href="/inventaire"
               className={`flex flex-col items-center px-2 border-r border-white/10 ${
                  pathname === "/inventaire" ? "text-primary" : "text-white"
               }`}
            >
               <Store size={22} className="" />
               <span className="text-[12px]">Inventaire</span>
            </Link>
            <Link
               href="/add-product"
               className={`flex flex-col items-center px-2 ${
                  pathname === "/add-product" ? "text-primary" : "text-white"
               }`}
            >
               <CirclePlus size={22} className="z-10" />
               <span className="text-[12px]">Ajouter</span>
            </Link>

            {/* <Link
               href="/dashboard"
               className="flex flex-col items-center px-2"
            >
               <CircleUser className=" text-white" />
               <span className="text-white text-[12px]">Dashboard</span>
            </Link> */}
         </div>
      </footer>
   );
}

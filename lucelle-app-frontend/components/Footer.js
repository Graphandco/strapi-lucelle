"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
   ShoppingCart,
   Store,
   CirclePlus,
   Home,
   Weight,
   BicepsFlexed,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
   const { user } = useAuth();
   const pathname = usePathname();
   if (!user) return null;

   const links = [
      {
         href: "/",
         label: "Accueil",
         icon: Home,
         isActive: pathname === "/",
      },
      {
         href: "/shopping-list",
         label: "Panier",
         icon: ShoppingCart,
         isActive: pathname === "/shopping-list",
      },
      {
         href: "/inventaire",
         label: "Inventaire",
         icon: Store,
         isActive: pathname === "/inventaire",
      },
      {
         href: "/fitness",
         label: "Fitness",
         icon: BicepsFlexed,
         isActive: pathname === "/fitness" || pathname.startsWith("/fitness/"),
      },
      {
         href: "/suivi-poids",
         label: "Poids",
         icon: Weight,
         isActive: pathname === "/suivi-poids",
         isLast: true,
      },
   ];

   return (
      <footer className="fixed z-10 bottom-0 left-0 w-full bg-card border-t border-white/10">
         <div className="mx-auto grid grid-cols-5 items-center justify-center">
            {links.map((link, index) => {
               const IconComponent = link.icon;
               return (
                  <Link
                     key={link.href}
                     href={link.href}
                     className={`flex flex-col items-center mx-2 pt-3 pb-2 
                        ${!link.isLast ? "" : ""} ${
                        link.isActive
                           ? "text-white border-t border-white"
                           : "text-white/30 "
                     }`}
                  >
                     <IconComponent size={22} />
                     <span className="text-[12px]">{link.label}</span>
                  </Link>
               );
            })}
         </div>
      </footer>
   );
}

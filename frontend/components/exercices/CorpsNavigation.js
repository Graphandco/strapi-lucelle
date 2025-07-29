"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CorpsNavigation() {
   const pathname = usePathname();

   const corpsData = [
      { slug: "bras", name: "Bras", color: "bg-blue-500" },
      { slug: "poitrine", name: "Poitrine", color: "bg-red-500" },
      { slug: "dos", name: "Dos", color: "bg-green-500" },
      { slug: "ventre", name: "Ventre", color: "bg-yellow-500" },
      { slug: "jambes", name: "Jambes", color: "bg-purple-500" },
   ];

   return (
      <nav className="flex flex-wrap gap-2 mb-6">
         {corpsData.map((corps) => {
            const isActive = pathname === `/fitness/${corps.slug}`;
            return (
               <Link
                  key={corps.slug}
                  href={`/fitness/${corps.slug}`}
                  className={cn(
                     "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                     "flex items-center gap-2",
                     isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  )}
               >
                  <div
                     className={cn("w-3 h-3 rounded-full", corps.color)}
                  ></div>
                  {corps.name}
               </Link>
            );
         })}
      </nav>
   );
}

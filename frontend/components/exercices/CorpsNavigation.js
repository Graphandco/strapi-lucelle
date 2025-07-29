"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useExercices } from "@/contexts/ExerciceContext";

export default function CorpsNavigation() {
   const pathname = usePathname();
   const { getUniqueCorps } = useExercices();

   const corpsData = getUniqueCorps();

   return (
      <nav className="flex flex-wrap gap-2 mb-6">
         {corpsData.map((corps) => {
            const isActive = pathname === `/fitness/${corps}`;
            return (
               <Link
                  key={corps}
                  href={`/fitness/${corps}`}
                  className={cn(
                     "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                     isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  )}
               >
                  <span className="capitalize">{corps}</span>
               </Link>
            );
         })}
      </nav>
   );
}

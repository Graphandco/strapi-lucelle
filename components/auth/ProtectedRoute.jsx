"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, redirectTo }) {
   const { isAuthenticated, isLoading } = useAuth();
   const router = useRouter();
   const pathname = usePathname();

   const loginHref =
      redirectTo || `/login?next=${encodeURIComponent(pathname)}`;

   useEffect(() => {
      if (!isLoading && !isAuthenticated) {
         router.replace(loginHref);
      }
   }, [isAuthenticated, isLoading, router, loginHref]);

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
         </div>
      );
   }

   if (!isAuthenticated) {
      return null;
   }

   return children;
}

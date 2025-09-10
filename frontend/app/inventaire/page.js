"use client";

import Inventaire from "@/components/products/Inventaire";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function InventairePage() {
   return (
      <ProtectedRoute>
         <div className="grid gap-8">
            <Inventaire />
         </div>
      </ProtectedRoute>
   );
}

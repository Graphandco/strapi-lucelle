"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MyProductsFavorites from "@/components/products/MyProductsFavorites";

export default function MyProductsPage() {
   return (
      <ProtectedRoute>
         <div className="grid gap-8">
            <MyProductsFavorites />
         </div>
      </ProtectedRoute>
   );
}

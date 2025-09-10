"use client";

import ShoppingList from "@/components/products/ShoppingList";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ShoppingListPage() {
   return (
      <ProtectedRoute>
         <div className="">
            <ShoppingList />
         </div>
      </ProtectedRoute>
   );
}

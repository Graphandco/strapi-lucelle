"use client";

import PageTitle from "@/components/PageTitle";
import AddProductForm from "@/components/products/AddProductForm";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AddProduct() {
   return (
      <ProtectedRoute>
         <div className="">
            <PageTitle title="Ajouter un produit" />
            <AddProductForm />
         </div>
      </ProtectedRoute>
   );
}

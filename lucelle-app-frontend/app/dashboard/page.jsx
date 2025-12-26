"use client";

import PageTitle from "@/components/PageTitle";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardProducts from "@/components/dashboard/DashboardProducts";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
   return (
      <ProtectedRoute>
         <div className="flex flex-col items-center">
            <PageTitle title="Tableau de bord" center />
            <DashboardHeader />

            <DashboardProducts />
         </div>
      </ProtectedRoute>
   );
}

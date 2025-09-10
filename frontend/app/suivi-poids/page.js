"use client";

import StatsPoids from "@/components/poids/StatsPoids";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function SuiviPoids() {
   return (
      <ProtectedRoute>
         <StatsPoids />
      </ProtectedRoute>
   );
}

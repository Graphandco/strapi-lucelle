"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
   const { user, logout } = useAuth();
   const router = useRouter();

   const handleLogout = () => {
      logout();
      router.push("/"); // Redirection vers la page d'accueil
   };

   return (
      <div className="wrapper py-20">
         <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
         <div className="p-6 rounded-lg shadow">
            <p className="mb-4">Bienvenue {user?.user?.username} !</p>
            <button
               onClick={handleLogout}
               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
               Déconnexion
            </button>
         </div>
      </div>
   );
}

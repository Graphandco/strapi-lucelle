"use client";

import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
   const { user, logout } = useAuth();
   const router = useRouter();
   const avatarUrl = user?.user?.avatar?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${user.user.avatar.url}`
      : null;

   const handleLogout = () => {
      logout();
      router.push("/");
   };

   return (
      <>
         {avatarUrl && (
            <Image
               src={avatarUrl}
               alt="Avatar utilisateur"
               width={100}
               height={100}
               className="rounded-full aspect-square object-cover"
               priority
            />
         )}
         <div className="">
            <p className="mb-4">Bienvenue {user?.user?.username} !</p>

            <button
               onClick={handleLogout}
               className="bg-red-500 font-normal text-white px-4 py-2 rounded hover:bg-red-600"
            >
               Déconnexion
            </button>
         </div>
      </>
   );
}

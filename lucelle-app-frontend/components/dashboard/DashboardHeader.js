"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { gravatarUrlFromEmail } from "@/lib/gravatarUrl";

export default function DashboardHeader() {
   const { user, logout } = useAuth();
   const router = useRouter();
   const [avatarUrl, setAvatarUrl] = useState(null);
   const [avatarFailed, setAvatarFailed] = useState(false);

   useEffect(() => {
      let cancelled = false;
      setAvatarFailed(false);
      if (!user?.email) {
         setAvatarUrl(null);
         return;
      }
      gravatarUrlFromEmail(user.email, {
         size: 200,
         defaultImage: "404",
      }).then((url) => {
         if (!cancelled) setAvatarUrl(url);
      });
      return () => {
         cancelled = true;
      };
   }, [user?.email]);

   const handleLogout = () => {
      logout();
      router.push("/");
   };

   return (
      <>
         {avatarUrl && !avatarFailed ? (
            <Image
               src={avatarUrl}
               alt="Avatar utilisateur"
               width={100}
               height={100}
               className="rounded-full aspect-square object-cover"
               priority
               onError={() => setAvatarFailed(true)}
            />
         ) : null}
         <div className="">
            <p className="mb-4">Bienvenue {user?.username} !</p>

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

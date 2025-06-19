"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
   const { user } = useAuth();

   const avatarUrl = user?.user?.avatar?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${user.user.avatar.url}`
      : null;

   return (
      <header className="bg-headerfooter">
         <div className="container py-4">
            <nav className="flex items-center justify-between">
               <Link
                  href="/"
                  className="flex items-center gap-3 font-base text-white text-lg"
               >
                  <Image
                     src="/logo.svg"
                     alt="Shopping List"
                     width={32}
                     height={32}
                  />
                  Shop'& Co
               </Link>

               <div className="flex items-center gap-4">
                  {user && (
                     <Link href="/dashboard">
                        <Avatar>
                           <AvatarImage src={avatarUrl} />
                           <AvatarFallback>
                              {user.user?.username?.charAt(0).toUpperCase()}
                           </AvatarFallback>
                        </Avatar>
                     </Link>
                  )}
               </div>
            </nav>
         </div>
      </header>
   );
}

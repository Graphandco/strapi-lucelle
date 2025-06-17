"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
   const { user } = useAuth();
   console.log("User data:", user);

   const avatarUrl = user?.user?.avatar?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${user.user.avatar.url}`
      : null;

   return (
      <header className="border-b border-primary/10">
         <div className="container py-4">
            <nav className="flex items-center justify-between">
               <Link href="/" className="flex items-center gap-2 font-bold">
                  <Image
                     src="/logo.svg"
                     alt="Shopping List"
                     width={32}
                     height={32}
                  />
                  Shopping List
               </Link>

               <div className="flex items-center gap-4">
                  {user ? (
                     <>
                        <Link href="/dashboard">
                           <Avatar>
                              <AvatarImage src={avatarUrl} />
                              <AvatarFallback>
                                 {user.user?.username?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                           </Avatar>
                        </Link>
                     </>
                  ) : (
                     <Link
                        href="/login"
                        className="text-gray-600 hover:text-gray-900"
                     >
                        Connexion
                     </Link>
                  )}
               </div>
            </nav>
         </div>
      </header>
   );
}

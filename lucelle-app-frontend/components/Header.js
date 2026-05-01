"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Header() {
   const { user, isAuthenticated, isLoading } = useAuth();

   const avatarUrl = user?.avatar?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${user.avatar.url}`
      : null;

   return (
      <>
         <header className="bg-card border-b border-white/10">
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
                     Lucelle App'
                  </Link>

                  <div className="flex items-center gap-4">
                     {!isLoading && (
                        <>
                           {isAuthenticated ? (
                              <Link href="/dashboard">
                                 <Avatar>
                                    <AvatarImage src={avatarUrl} />
                                    <AvatarFallback>
                                       {user?.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                 </Avatar>
                              </Link>
                           ) : (
                              <div className="flex items-center gap-2">
                                 <Button variant="ghost" asChild className="text-white">
                                    <Link href="/signup">Inscription</Link>
                                 </Button>
                                 <Button asChild>
                                    <Link href="/login">Connexion</Link>
                                 </Button>
                              </div>
                           )}
                        </>
                     )}
                  </div>
               </nav>
            </div>
         </header>
      </>
   );
}

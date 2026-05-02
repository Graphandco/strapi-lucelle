"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { gravatarUrlFromEmail } from "@/lib/gravatarUrl";

export default function Header() {
   const { user, isAuthenticated, isLoading } = useAuth();
   const [avatarUrl, setAvatarUrl] = useState(null);

   useEffect(() => {
      let cancelled = false;
      if (!user?.email) {
         setAvatarUrl(null);
         return;
      }
      gravatarUrlFromEmail(user.email, {
         size: 64,
         defaultImage: "404",
      }).then((url) => {
         if (!cancelled) setAvatarUrl(url);
      });
      return () => {
         cancelled = true;
      };
   }, [user?.email]);

   return (
      <>
         <header className="bg-card border-b border-white/10 sticky top-0 z-50">
            <div className="container py-2">
               <nav className="flex items-center justify-between">
                  <Link
                     href="/"
                     className="flex items-center gap-3 font-base text-white text-lg"
                  >
                     <Image
                        src="/logo.png"
                        alt="Shopping List"
                        width={40}
                        height={40}
                     />
                     Graph & Shop
                  </Link>

                  <div className="flex items-center gap-4">
                     {!isLoading && (
                        <>
                           {isAuthenticated ? (
                              <Link href="/dashboard">
                                 <Avatar>
                                    <AvatarImage
                                       src={avatarUrl || undefined}
                                       alt={`Avatar ${user?.username ?? ""}`}
                                    />
                                    <AvatarFallback>
                                       {user?.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                 </Avatar>
                              </Link>
                           ) : (
                              <div className="flex items-center gap-2">
                                 <Button
                                    variant="ghost"
                                    asChild
                                    className="text-white"
                                 >
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

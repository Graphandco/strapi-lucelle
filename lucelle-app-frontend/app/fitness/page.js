"use client";

import { useExercices } from "@/contexts/ExerciceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import PageTitle from "@/components/PageTitle";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Fitness() {
   const { exerciceTypes, loading, getUniqueCorps } = useExercices();

   // Récupérer les parties du corps uniques depuis Strapi
   const corpsData = getUniqueCorps();

   // Compter les exercices par partie du corps
   const corpsCounts = {};
   exerciceTypes.forEach((type) => {
      if (type.corps) {
         corpsCounts[type.corps] = (corpsCounts[type.corps] || 0) + 1;
      }
   });

   if (loading) {
      return (
         <div className="flex justify-center items-center">
            <div className="text-lg">Chargement...</div>
         </div>
      );
   }

   return (
      <ProtectedRoute>
         <div className="">
            <div className="mb-8">
               <PageTitle title="Fitness" />
               <p className="text-muted-foreground">
                  Choisissez une partie du corps pour voir les exercices
                  disponibles
               </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
               <Link href="/fitness/course">
                  <Card className="py-2 gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                     <CardHeader>
                        <CardTitle className="text-xl capitalize">
                           Course
                        </CardTitle>
                     </CardHeader>

                     <CardContent>
                        <div className="pl-2">
                           <Image
                              src="/corps/course.png"
                              alt="Course à pied"
                              width={75}
                              height={75}
                              className="mx-auto"
                           />
                        </div>
                     </CardContent>
                  </Card>
               </Link>

               {corpsData.map((corps) => (
                  <Link key={corps} href={`/fitness/${corps}`}>
                     <Card className="py-2 gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                        <CardHeader>
                           <CardTitle className="text-xl capitalize">
                              {corps}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="pl-2">
                              <Image
                                 src={`/corps/${corps}.png`}
                                 alt={`Exercices pour les ${corps}`}
                                 width={75}
                                 height={75}
                                 className="mx-auto"
                              />
                           </div>
                           {/* <div className="flex items-center justify-between px-2">
                              <span className="text-sm text-muted-foreground">
                                 {corpsCounts[corps] || 0} exercice
                                 {(corpsCounts[corps] || 0) > 1 ? "s" : ""}
                              </span>
                              <ArrowRightIcon className="w-5 h-5 text-primary" />
                           </div> */}
                        </CardContent>
                     </Card>
                  </Link>
               ))}
            </div>
         </div>
      </ProtectedRoute>
   );
}

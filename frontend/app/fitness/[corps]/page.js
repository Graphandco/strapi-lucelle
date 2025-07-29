"use client";

import { useExercices } from "@/contexts/ExerciceContext";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CorpsNavigation from "@/components/exercices/CorpsNavigation";
import PageTitle from "@/components/PageTitle";
import Link from "next/link";

export default function CorpsPage() {
   const { corps } = useParams();
   const { exerciceTypes, loading } = useExercices();

   // Filtre les types d'exercices par partie du corps
   const filteredTypes = exerciceTypes.filter((type) => type.corps === corps);

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg">Chargement...</div>
         </div>
      );
   }

   return (
      <div className="">
         <PageTitle title={corps} className="capitalize" />

         <CorpsNavigation />

         {filteredTypes.length === 0 ? (
            <div className="text-center py-12">
               <p className="text-lg text-muted-foreground">
                  Aucun exercice trouvé pour cette partie du corps.
               </p>
            </div>
         ) : (
            <div className="grid grid-cols-2 gap-2">
               {filteredTypes.map((type) => (
                  <Link key={type.id} href={`/fitness/${corps}/${type.id}`}>
                     <Card className="gap-2 py-2 hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                           <CardTitle className="text-center">
                              {type.name}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           {type.image && (
                              <div className="">
                                 <Image
                                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${type.image.formats.thumbnail.url}`}
                                    alt={type.name}
                                    width={75}
                                    height={75}
                                    className="mx-auto filter brightness-0 invert"
                                 />
                              </div>
                           )}
                        </CardContent>
                     </Card>
                  </Link>
               ))}
            </div>
         )}
      </div>
   );
}

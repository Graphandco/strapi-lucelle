"use client";

import { useExercices } from "@/contexts/ExerciceContext";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CorpsNavigation from "@/components/exercices/CorpsNavigation";

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
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
               Exercices pour les <span className="capitalize">{corps}</span>
            </h1>
            <p className="text-muted-foreground">
               Découvrez tous les types d'exercices pour muscler vos{" "}
               <span className="capitalize">{corps}</span>
            </p>
         </div>

         <CorpsNavigation />

         {filteredTypes.length === 0 ? (
            <div className="text-center py-12">
               <p className="text-lg text-muted-foreground">
                  Aucun exercice trouvé pour cette partie du corps.
               </p>
            </div>
         ) : (
            <div className="grid grid-cols-2 gap-6">
               {filteredTypes.map((type) => (
                  <Card
                     key={type.id}
                     className="gap-2 py-2 hover:shadow-lg transition-shadow"
                  >
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
                                 width={100}
                                 height={100}
                                 className="mx-auto filter brightness-0 invert"
                              />
                           </div>
                        )}
                        {/* <div className="flex justify-between items-center">
                           <span className="text-sm text-muted-foreground capitalize">
                              {type.corps}
                           </span>
                           <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                              Voir les exercices
                           </button>
                        </div> */}
                     </CardContent>
                  </Card>
               ))}
            </div>
         )}
      </div>
   );
}

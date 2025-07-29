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

   // Mapping des noms de parties du corps
   const corpsNames = {
      bras: "Bras",
      poitrine: "Poitrine",
      dos: "Dos",
      ventre: "Ventre",
      jambes: "Jambes",
   };

   const corpsName = corpsNames[corps] || corps;

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg">Chargement...</div>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
               Exercices pour les {corpsName}
            </h1>
            <p className="text-muted-foreground">
               Découvrez tous les types d'exercices pour muscler vos{" "}
               {corpsName.toLowerCase()}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredTypes.map((type) => (
                  <Card
                     key={type.id}
                     className="hover:shadow-lg transition-shadow"
                  >
                     <CardHeader>
                        <CardTitle className="text-lg">{type.name}</CardTitle>
                     </CardHeader>
                     <CardContent>
                        {type.image && (
                           <div className="mb-4">
                              <Image
                                 src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${type.image.formats.thumbnail.url}`}
                                 alt={type.name}
                                 width={200}
                                 height={200}
                                 className="w-full h-48 object-cover rounded-lg"
                              />
                           </div>
                        )}
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-muted-foreground capitalize">
                              {type.corps}
                           </span>
                           <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                              Voir les exercices
                           </button>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         )}
      </div>
   );
}

"use client";

import { useExercices } from "@/contexts/ExerciceContext";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default function ExerciceTypePage() {
   const { corps, typeId } = useParams();
   const { exerciceTypes, loading, getExercicesByType, getExerciceTypeById } =
      useExercices();

   const exerciceType = getExerciceTypeById(parseInt(typeId));
   const exercices = getExercicesByType(parseInt(typeId));

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg">Chargement...</div>
         </div>
      );
   }

   if (!exerciceType) {
      return (
         <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
               Type d'exercice non trouvé.
            </p>
         </div>
      );
   }

   return (
      <div className="">
         <div className="mb-6">
            <Link
               href={`/fitness/${corps}`}
               className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
            >
               <ArrowLeftIcon className="w-4 h-4" />
               Retour aux exercices pour les{" "}
               <span className="capitalize">{corps}</span>
            </Link>

            <PageTitle title={exerciceType.name} className="capitalize" />
         </div>

         {exercices.length === 0 ? (
            <div className="text-center py-12">
               <p className="text-lg text-muted-foreground">
                  Aucun exercice enregistré pour ce type.
               </p>
            </div>
         ) : (
            <div className="space-y-6">
               {(() => {
                  // Grouper les exercices par date
                  const groupedExercices = exercices.reduce(
                     (groups, exercice) => {
                        const date = exercice.date;
                        if (!groups[date]) {
                           groups[date] = [];
                        }
                        groups[date].push(exercice);
                        return groups;
                     },
                     {}
                  );

                  // Convertir en tableau et trier par date (plus récent en premier)
                  const sortedDates = Object.keys(groupedExercices).sort(
                     (a, b) => new Date(b) - new Date(a)
                  );

                  return sortedDates.map((date) => (
                     <Card
                        key={date}
                        className="py-2 gap-2 hover:shadow-lg transition-shadow"
                     >
                        <CardHeader>
                           <CardTitle className="text-lg">
                              {format(new Date(date), "EEEE d MMMM yyyy", {
                                 locale: fr,
                              })}
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="px-2">
                           <div className="space-y-3">
                              {groupedExercices[date].map((exercice) => (
                                 <div
                                    key={exercice.id}
                                    className="grid grid-cols-3 gap-4 text-sm"
                                 >
                                    <div>
                                       <span className="text-muted-foreground">
                                          Séries:
                                       </span>
                                       <div className="font-semibold">
                                          {exercice.series}
                                       </div>
                                    </div>
                                    <div>
                                       <span className="text-muted-foreground">
                                          Répétitions:
                                       </span>
                                       <div className="font-semibold">
                                          {exercice.repetitions}
                                       </div>
                                    </div>
                                    <div>
                                       <span className="text-muted-foreground">
                                          Poids:
                                       </span>
                                       <div className="font-semibold">
                                          {exercice.poids
                                             ? `${exercice.poids} kg`
                                             : "Sans poids"}
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </CardContent>
                     </Card>
                  ));
               })()}
            </div>
         )}
      </div>
   );
}

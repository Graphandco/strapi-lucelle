"use client";

import { useExercices } from "@/contexts/ExerciceContext";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeftIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import AddExerciceForm from "@/components/exercices/AddExerciceForm";
import { useState } from "react";

export default function ExerciceTypePage() {
   const { corps, typeId } = useParams();
   const { user } = useAuth();
   const {
      exerciceTypes,
      loading,
      getExercicesByType,
      getExerciceTypeById,
      deleteExercice,
   } = useExercices();
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [deletingId, setDeletingId] = useState(null);

   const exerciceType = getExerciceTypeById(parseInt(typeId));
   const exercices = getExercicesByType(parseInt(typeId));

   const handleDelete = async (exerciceId) => {
      if (!confirm("Êtes-vous sûr de vouloir supprimer cet exercice ?")) {
         return;
      }

      setDeletingId(exerciceId);
      try {
         await deleteExercice(exerciceId, user.jwt);
      } catch (error) {
         console.error("Erreur lors de la suppression:", error);
         alert("Erreur lors de la suppression de l'exercice");
      } finally {
         setDeletingId(null);
      }
   };

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
               Exercices {corps}
            </Link>

            <div className="grid">
               <PageTitle title={exerciceType.name} className="capitalize" />

               <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                     <Button className="bg-primary hover:bg-primary/90">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Ajouter un exercice
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                     <DialogHeader>
                        <DialogTitle>Ajouter un exercice</DialogTitle>
                        <DialogDescription>
                           Saisissez les détails de votre exercice.
                        </DialogDescription>
                     </DialogHeader>
                     <AddExerciceForm
                        typeId={typeId}
                        onSuccess={() => setIsDialogOpen(false)}
                     />
                  </DialogContent>
               </Dialog>
            </div>
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
                        <CardHeader className="px-4">
                           <div className="flex justify-between items-center">
                              <CardTitle className="text-lg">
                                 {format(new Date(date), "EEEE d MMMM yyyy", {
                                    locale: fr,
                                 })}
                              </CardTitle>
                           </div>
                        </CardHeader>
                        <CardContent className="px-4">
                           <div className="space-y-3">
                              {groupedExercices[date].map((exercice) => (
                                 <div
                                    key={exercice.id}
                                    className="flex justify-between items-center"
                                 >
                                    <div className="grid grid-cols-3 gap-4 text-sm flex-1">
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
                                    <button
                                       onClick={() => handleDelete(exercice.id)}
                                       disabled={deletingId === exercice.id}
                                       className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 ml-4"
                                       title="Supprimer cet exercice"
                                    >
                                       <Trash2Icon className="w-4 h-4" />
                                    </button>
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

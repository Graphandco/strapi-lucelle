"use client";

import PageTitle from "@/components/PageTitle";
import { useExercices } from "@/contexts/ExerciceContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import AddCourseForm from "@/components/exercices/courses/AddCourseForm";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState, useCallback } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Course() {
   const { allCourses, loading, deleteCourse } = useExercices();
   const { user } = useAuth();
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [deletingId, setDeletingId] = useState(null);

   const handleDelete = async (courseId) => {
      console.log("[handleDelete] Tentative suppression course:", courseId);

      if (!confirm("Êtes-vous sûr de vouloir supprimer cette course ?")) {
         return;
      }

      setDeletingId(courseId);
      try {
         console.log("[handleDelete] Appel deleteCourse...");
         await deleteCourse(courseId, user.jwt);
         console.log("[handleDelete] deleteCourse terminé");
      } catch (error) {
         console.error("Erreur lors de la suppression:", error);
         alert("Erreur lors de la suppression de la course");
      } finally {
         setDeletingId(null);
      }
   };

   // Fonction pour calculer la valeur manquante
   const getCalculatedValue = (course, field) => {
      const duree = parseFloat(course.duree);
      const distance = parseFloat(course.distance);
      const vitesse = parseFloat(course.vitesse);

      const hasDuree = !isNaN(duree) && duree > 0;
      const hasDistance = !isNaN(distance) && distance > 0;
      const hasVitesse = !isNaN(vitesse) && vitesse > 0;

      const providedCount = [hasDuree, hasDistance, hasVitesse].filter(
         Boolean
      ).length;

      if (providedCount >= 2) {
         if (field === "duree" && !hasDuree && hasDistance && hasVitesse) {
            return ((distance / vitesse) * 60).toFixed(1);
         } else if (
            field === "distance" &&
            !hasDistance &&
            hasDuree &&
            hasVitesse
         ) {
            return (vitesse * (duree / 60)).toFixed(1);
         } else if (
            field === "vitesse" &&
            !hasVitesse &&
            hasDuree &&
            hasDistance
         ) {
            return (distance / (duree / 60)).toFixed(1);
         }
      }

      return null;
   };

   // Fonction pour déterminer si une valeur a été calculée
   const isCalculatedValue = (course, field) => {
      const calculatedValue = getCalculatedValue(course, field);
      return calculatedValue !== null;
   };

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg">Chargement...</div>
         </div>
      );
   }

   return (
      <ProtectedRoute>
         <div>
            <PageTitle title="Course à pied" />

            <div className="">
               <div className="mb-6">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                     <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                           <PlusIcon className="w-4 h-4 mr-2" />
                           Ajouter une course
                        </Button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                           <DialogTitle>Ajouter une course</DialogTitle>
                           <DialogDescription>
                              Saisissez au moins 2 valeurs pour calculer
                              automatiquement la 3ème.
                           </DialogDescription>
                        </DialogHeader>
                        <AddCourseForm onSuccess={() => setIsDialogOpen(false)} />
                     </DialogContent>
                  </Dialog>
               </div>

               {allCourses.length === 0 ? (
                  <div className="text-center py-12">
                     <p className="text-lg text-muted-foreground">
                        Aucune course enregistrée.
                     </p>
                  </div>
               ) : (
                  <div className="space-y-6">
                     {allCourses.map((course) => (
                        <Card
                           key={course.id}
                           className="py-2 gap-2 hover:shadow-lg transition-shadow"
                        >
                           <CardHeader className="px-4">
                              <div className="flex justify-between items-center">
                                 <CardTitle className="text-lg">
                                    {format(
                                       new Date(course.date),
                                       "EEEE d MMMM yyyy",
                                       {
                                          locale: fr,
                                       }
                                    )}
                                 </CardTitle>
                              </div>
                           </CardHeader>
                           <CardContent className="px-4">
                              <div className="flex justify-between items-center">
                                 <div className="grid grid-cols-3 gap-4 text-sm flex-1">
                                    <div>
                                       <span className="text-muted-foreground">
                                          Durée:
                                       </span>
                                       <div
                                          className={`font-semibold ${
                                             isCalculatedValue(course, "duree")
                                                ? "text-green-400"
                                                : "text-white"
                                          }`}
                                       >
                                          {(() => {
                                             const calculatedValue =
                                                getCalculatedValue(
                                                   course,
                                                   "duree"
                                                );
                                             const displayValue =
                                                course.duree || calculatedValue;

                                             return (
                                                <>
                                                   {displayValue
                                                      ? `${displayValue} min`
                                                      : "Non renseigné"}
                                                   {isCalculatedValue(
                                                      course,
                                                      "duree"
                                                   ) && (
                                                      <span className="text-xs text-green-400 block">
                                                         (calculée)
                                                      </span>
                                                   )}
                                                </>
                                             );
                                          })()}
                                       </div>
                                    </div>
                                    <div>
                                       <span className="text-muted-foreground">
                                          Distance:
                                       </span>
                                       <div
                                          className={`font-semibold ${
                                             isCalculatedValue(course, "distance")
                                                ? "text-green-400"
                                                : "text-white"
                                          }`}
                                       >
                                          {(() => {
                                             const calculatedValue =
                                                getCalculatedValue(
                                                   course,
                                                   "distance"
                                                );
                                             const displayValue =
                                                course.distance || calculatedValue;

                                             return (
                                                <>
                                                   {displayValue
                                                      ? `${displayValue} km`
                                                      : "Non renseigné"}
                                                   {isCalculatedValue(
                                                      course,
                                                      "distance"
                                                   ) && (
                                                      <span className="text-xs text-green-400 block">
                                                         (calculée)
                                                      </span>
                                                   )}
                                                </>
                                             );
                                          })()}
                                       </div>
                                    </div>
                                    <div>
                                       <span className="text-muted-foreground">
                                          Vitesse:
                                       </span>
                                       <div
                                          className={`font-semibold ${
                                             isCalculatedValue(course, "vitesse")
                                                ? "text-green-400"
                                                : "text-white"
                                          }`}
                                       >
                                          {(() => {
                                             const calculatedValue =
                                                getCalculatedValue(
                                                   course,
                                                   "vitesse"
                                                );
                                             const displayValue =
                                                course.vitesse || calculatedValue;

                                             return (
                                                <>
                                                   {displayValue
                                                      ? `${displayValue} km/h`
                                                      : "Non renseigné"}
                                                   {isCalculatedValue(
                                                      course,
                                                      "vitesse"
                                                   ) && (
                                                      <span className="text-xs text-green-400 block">
                                                         (calculée)
                                                      </span>
                                                   )}
                                                </>
                                             );
                                          })()}
                                       </div>
                                    </div>
                                 </div>
                                 <button
                                    onClick={() => handleDelete(course.id)}
                                    disabled={deletingId === course.id}
                                    className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 ml-4"
                                    title="Supprimer cette course"
                                 >
                                    <Trash2Icon className="w-4 h-4" />
                                 </button>
                              </div>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </ProtectedRoute>
   );
}

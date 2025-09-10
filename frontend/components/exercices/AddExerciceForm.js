"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useExercices } from "@/contexts/ExerciceContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addExercice } from "@/actions/addExercice";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AddExerciceForm({ typeId, onSuccess }) {
   const { user, jwt } = useAuth();
   const { refreshExercices } = useExercices();
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [date, setDate] = useState(new Date());
   const [open, setOpen] = useState(false);

   async function handleSubmit(event) {
      event.preventDefault();
      setLoading(true);
      setError(null);

      const formData = new FormData(event.target);
      formData.append("token", jwt);
      formData.append("date", format(date, "yyyy-MM-dd"));
      formData.append("typeId", typeId);

      try {
         const result = await addExercice(formData);

         if (!result.success) {
            throw new Error(
               result.error || "Erreur lors de l'ajout de l'exercice"
            );
         }

         // Recharger tous les exercices
         await refreshExercices();

         // Appeler la fonction de succès si fournie
         if (onSuccess) {
            onSuccess();
         }

         // Rediriger vers la même page pour voir le nouvel exercice
         router.refresh();
      } catch (error) {
         console.error("Erreur détaillée:", error);
         setError(error.message);
      } finally {
         setLoading(false);
      }
   }

   return (
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
         <div className="grid grid-cols-2 gap-4">
            <div>
               <input
                  type="number"
                  id="series"
                  name="series"
                  min="1"
                  max="20"
                  required
                  placeholder="Séries"
                  className="bg-card outline-none border-none rounded-lg w-full p-4 placeholder:text-white placeholder:text-sm"
               />
            </div>
            <div>
               <input
                  type="number"
                  id="repetitions"
                  name="repetitions"
                  min="1"
                  max="100"
                  required
                  placeholder="Répétitions"
                  className="bg-card outline-none border-none rounded-lg w-full p-4 placeholder:text-white placeholder:text-sm"
               />
            </div>
         </div>

         <div>
            <input
               type="number"
               id="poids"
               name="poids"
               step="0.5"
               min="0"
               max="500"
               placeholder="Poids (kg) - optionnel"
               className="bg-card outline-none border-none rounded-lg w-full p-4 placeholder:text-white placeholder:text-sm"
            />
         </div>

         <div>
            <Popover open={open} onOpenChange={setOpen}>
               <PopoverTrigger asChild>
                  <Button
                     variant="outline"
                     className="w-full justify-start text-left font-normal bg-card border-none rounded-lg p-4 text-white"
                  >
                     <CalendarIcon className="mr-2 h-4 w-4" />
                     {date
                        ? format(date, "PPP", { locale: fr })
                        : "Sélectionner une date"}
                  </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                     mode="single"
                     selected={date}
                     onSelect={(selectedDate) => {
                        setDate(selectedDate);
                        setOpen(false);
                     }}
                     initialFocus
                     locale={fr}
                     weekStartsOn={1}
                  />
               </PopoverContent>
            </Popover>
         </div>

         {error && <div className="text-red-500 text-sm">{error}</div>}

         <button
            type="submit"
            disabled={loading}
            className="w-full font-normal bg-primary text-black py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
         >
            {loading ? "Ajout en cours..." : "Ajouter l'exercice"}
         </button>
      </form>
   );
}

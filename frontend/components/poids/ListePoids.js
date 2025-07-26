import { useWeights } from "@/contexts/WeightContext";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

export default function ListePoids({ allWeights }) {
   const { deleteWeight } = useWeights();
   const { user } = useAuth();
   const [deletingId, setDeletingId] = useState(null);

   const handleDelete = async (weightId) => {
      if (!confirm("Êtes-vous sûr de vouloir supprimer cette mesure ?")) {
         return;
      }

      setDeletingId(weightId);

      try {
         await deleteWeight(weightId, user.jwt);
      } catch (error) {
         console.error("Erreur lors de la suppression:", error);
         alert("Erreur lors de la suppression de la mesure");
      } finally {
         setDeletingId(null);
      }
   };

   return (
      <div className="mt-8">
         <h3 className="text-lg font-semibold mb-4">Historique des mesures</h3>
         <div className="space-y-2">
            {allWeights
               .sort((a, b) => new Date(a.date) - new Date(b.date))
               .map((weight) => {
                  const date = new Date(weight.date);
                  const formattedDate = date.toLocaleDateString("fr-FR", {
                     day: "numeric",
                     month: "long",
                     year: "numeric",
                  });

                  return (
                     <div key={weight.id} className="">
                        <div className="flex justify-between items-center">
                           <span className="">{formattedDate}</span>
                           <div className="flex items-center gap-3">
                              <span className="text-primary">
                                 {weight.poids} kg
                              </span>
                              <button
                                 onClick={() => handleDelete(weight.documentId)}
                                 disabled={deletingId === weight.documentId}
                                 className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                 title="Supprimer cette mesure"
                              >
                                 <Trash2Icon className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                        <hr className="w-full border-white/10 my-1" />
                     </div>
                  );
               })}
         </div>
      </div>
   );
}

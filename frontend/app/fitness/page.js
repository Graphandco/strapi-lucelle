"use client";

import { useExercices } from "@/contexts/ExerciceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export default function Fitness() {
   const { exerciceTypes, loading } = useExercices();

   // Définition des parties du corps avec leurs icônes et descriptions
   const corpsData = {
      bras: {
         name: "Bras",
         description: "Biceps, triceps et avant-bras",
         color: "bg-blue-500",
         count: 0,
      },
      poitrine: {
         name: "Poitrine",
         description: "Pectoraux et épaules",
         color: "bg-red-500",
         count: 0,
      },
      dos: {
         name: "Dos",
         description: "Dorsaux et trapèzes",
         color: "bg-green-500",
         count: 0,
      },
      ventre: {
         name: "Ventre",
         description: "Abdominaux et obliques",
         color: "bg-yellow-500",
         count: 0,
      },
      jambes: {
         name: "Jambes",
         description: "Cuisses et mollets",
         color: "bg-purple-500",
         count: 0,
      },
   };

   // Compter les exercices par partie du corps
   exerciceTypes.forEach((type) => {
      if (corpsData[type.corps]) {
         corpsData[type.corps].count++;
      }
   });

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
            <h1 className="text-3xl font-bold text-primary mb-2">Fitness</h1>
            <p className="text-muted-foreground">
               Choisissez une partie du corps pour voir les exercices
               disponibles
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(corpsData).map(([corps, data]) => (
               <Link key={corps} href={`/fitness/${corps}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                     <CardHeader>
                        <div className="flex items-center justify-between">
                           <CardTitle className="text-xl">
                              {data.name}
                           </CardTitle>
                           <div
                              className={`w-4 h-4 rounded-full ${data.color}`}
                           ></div>
                        </div>
                     </CardHeader>
                     <CardContent>
                        <p className="text-muted-foreground mb-4">
                           {data.description}
                        </p>
                        <div className="flex items-center justify-between">
                           <span className="text-sm text-muted-foreground">
                              {data.count} exercice{data.count > 1 ? "s" : ""}
                           </span>
                           <ArrowRightIcon className="w-5 h-5 text-primary" />
                        </div>
                     </CardContent>
                  </Card>
               </Link>
            ))}
         </div>
      </div>
   );
}

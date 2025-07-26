"use client";

import { useWeights } from "@/contexts/WeightContext";
import {
   LineChart as RechartsLineChart,
   Line as RechartsLine,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
} from "recharts";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
} from "@/components/ui/chart";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from "lucide-react";
import ListePoids from "./ListePoids";
import AddWeightForm from "./AddWeightForm";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";

export default function StatsPoids() {
   const { allWeights, loading } = useWeights();
   const { poids, date } = allWeights;
   const [isDialogOpen, setIsDialogOpen] = useState(false);

   // Calcule le mois en cours pour l'état initial
   const getCurrentMonthIndex = () => {
      const currentDate = new Date();
      return currentDate.getMonth(); // 0 = Janvier, 1 = Février, etc.
   };

   const [currentMonth, setCurrentMonth] = useState(getCurrentMonthIndex());

   // Récupère tous les mois disponibles dans les données
   const allAvailableMonths = Array.from(
      new Set(allWeights.map((w) => format(new Date(w.date), "yyyy-MM")))
   ).sort();

   // Calcule les mois pour la période actuelle (2 mois + 1 mois de référence)
   const getCurrentMonths = (startMonth) => {
      const year = new Date(allWeights[0]?.date || new Date()).getFullYear();

      const currentMonths = [];
      for (let i = 0; i < 3; i++) {
         const monthIndex = startMonth + i;
         const monthDate = new Date(year, monthIndex, 1);
         currentMonths.push(format(monthDate, "yyyy-MM"));
      }

      return currentMonths;
   };

   const currentQuarterMonths = getCurrentMonths(currentMonth);

   // Filtre les données pour n'afficher que celles de la période actuelle (2 premiers mois)
   const filteredWeights = allWeights.filter((weight) => {
      const weightMonth = format(new Date(weight.date), "yyyy-MM");
      return currentQuarterMonths.slice(0, 2).includes(weightMonth);
   });

   // Trie les données par ordre chronologique et ajoute un timestamp normalisé
   const sortedWeights = filteredWeights
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((weight, index) => {
         const daysSinceFirst =
            index === 0
               ? 0
               : Math.floor(
                    (new Date(weight.date) -
                       new Date(filteredWeights[0].date)) /
                       (1000 * 60 * 60 * 24)
                 );

         // Calcule la position relative dans le mois (0 = début du mois, 1 = fin du mois)
         const currentDate = new Date(weight.date);
         const monthStart = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
         );
         const monthEnd = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
         );
         const daysInMonth = monthEnd.getDate();
         const dayOfMonth = currentDate.getDate();
         const relativePosition = (dayOfMonth - 1) / (daysInMonth - 1); // 0 à 1

         // Trouve l'index du mois dans la liste des mois du trimestre
         const monthKey = format(currentDate, "yyyy-MM");
         const monthIndex = currentQuarterMonths.indexOf(monthKey);

         // Calcule la position finale (index du mois + position relative dans le mois)
         const finalPosition = monthIndex + relativePosition;

         return {
            ...weight,
            timestamp: finalPosition, // Position dans l'axe X avec espacement égal
            poids: parseFloat(weight.poids),
         };
      });

   // Crée des ticks personnalisés pour les mois avec largeur égale
   const monthTicks = currentQuarterMonths.map((monthKey, index) => {
      const currentDate = new Date(monthKey + "-01");
      return {
         value: index, // Index pour espacement égal
         label: currentDate.toLocaleDateString("fr-FR", { month: "long" }),
      };
   });

   // Fonction de formatage des ticks pour afficher le mois
   const formatTick = (index) => {
      const tick = monthTicks.find((t) => t.value === index);
      return tick ? tick.label : "";
   };

   // Fonction de formatage pour le tooltip
   const formatTooltip = (value, name, props) => {
      // Utilise directement la date de l'entrée de poids
      const currentDate = new Date(props.payload.date);
      return [`${format(currentDate, "dd/MM/yyyy")} : ${value} kg`, ""];
   };

   // Fonctions de navigation
   const goToPreviousMonth = () => {
      setCurrentMonth((prev) => Math.max(0, prev - 1));
   };

   const goToNextMonth = () => {
      setCurrentMonth((prev) => Math.min(10, prev + 1)); // 10 = Novembre (dernier mois possible pour avoir 2 mois + 1 mois de référence)
   };

   const getMonthLabel = (month) => {
      const year = new Date(allWeights[0]?.date || new Date()).getFullYear();
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, Math.min(month + 1, 11), 1);

      const startMonth = startDate.toLocaleDateString("fr-FR", {
         month: "long",
      });
      const endMonth = endDate.toLocaleDateString("fr-FR", { month: "long" });

      return `${startMonth} - ${endMonth} ${year}`;
   };

   return (
      <div>
         <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl pb-5 px-1 text-primary flex items-center gap-2">
               Statistiques de poids
            </h1>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
               <DialogTrigger asChild>
                  <Button className="bg-primary  hover:bg-primary/90">
                     <PlusIcon className="w-4 h-4 mr-2" />
                     Ajouter une mesure
                  </Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                     <DialogTitle>Ajouter une mesure de poids</DialogTitle>
                     <DialogDescription>
                        Saisissez votre poids et la date de mesure.
                     </DialogDescription>
                  </DialogHeader>
                  <AddWeightForm onSuccess={() => setIsDialogOpen(false)} />
               </DialogContent>
            </Dialog>
         </div>

         {/* Navigation des mois */}
         <div className="flex items-center justify-between mb-4">
            <button
               onClick={goToPreviousMonth}
               disabled={currentMonth === 0}
               className="bg-primary text-black py-2 px-4 rounded-md hover:bg-primary/90"
            >
               <ArrowLeftIcon className="w-4 h-4" />
            </button>
            <span className="text-lg font-semibold">
               {getMonthLabel(currentMonth)}
            </span>
            <button
               onClick={goToNextMonth}
               disabled={currentMonth === 10}
               className="bg-primary text-black py-2 px-4 rounded-md hover:bg-primary/90"
            >
               <ArrowRightIcon className="w-4 h-4" />
            </button>
         </div>

         {/* Graphique Shadcn/ui Chart */}
         <div className="mb-8 w-full">
            <Card className="w-full">
               <CardHeader>
                  <CardTitle>Suivi de poids</CardTitle>
                  <CardDescription>
                     Évolution du poids dans le temps
                  </CardDescription>
               </CardHeader>
               <CardContent className="w-full">
                  <ChartContainer
                     data={sortedWeights}
                     config={{
                        poids: {
                           label: "Poids",
                           color: "hsl(var(--chart-1))",
                        },
                     }}
                     className="h-[300px] w-full"
                  >
                     <RechartsLineChart data={sortedWeights}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                           dataKey="timestamp"
                           tickFormatter={formatTick}
                           ticks={[0, 1, 2]}
                           padding={{ left: 20, right: 20 }}
                           type="number"
                           angle={0}
                           textAnchor="middle"
                           height={40}
                           domain={[0, 1]}
                        />
                        <YAxis
                           dataKey="poids"
                           domain={[60, 80]}
                           tickFormatter={(value) => `${value} kg`}
                        />
                        <ChartTooltip
                           content={<ChartTooltipContent />}
                           formatter={formatTooltip}
                        />
                        <RechartsLine
                           type="monotone"
                           dataKey="poids"
                           stroke="var(--primary)"
                           strokeWidth={1}
                           dot={{ r: 4 }}
                           activeDot={{ r: 6 }}
                        />
                     </RechartsLineChart>
                  </ChartContainer>
               </CardContent>
            </Card>
         </div>

         <ListePoids allWeights={allWeights} />
      </div>
   );
}

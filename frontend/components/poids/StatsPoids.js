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

export default function StatsPoids() {
   const { allWeights, loading } = useWeights();
   const { poids, date } = allWeights;

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
      const monthNames = [
         "Janvier",
         "Février",
         "Mars",
         "Avril",
         "Mai",
         "Juin",
         "Juillet",
         "Août",
         "Septembre",
         "Octobre",
         "Novembre",
         "Décembre",
      ];
      return {
         value: index, // Index pour espacement égal
         label: monthNames[currentDate.getMonth()],
      };
   });

   // Fonction de formatage des ticks pour afficher le mois
   const formatTick = (index) => {
      const tick = monthTicks.find((t) => t.value === index);
      return tick ? tick.label : "";
   };

   // Fonction de formatage pour le tooltip
   const formatTooltip = (value, name, props) => {
      const firstDate = new Date(allWeights[0].date);
      const currentDate = new Date(
         firstDate.getTime() + props.payload.timestamp * 24 * 60 * 60 * 1000
      );
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
      const monthNames = [
         "Janvier",
         "Février",
         "Mars",
         "Avril",
         "Mai",
         "Juin",
         "Juillet",
         "Août",
         "Septembre",
         "Octobre",
         "Novembre",
         "Décembre",
      ];
      const startMonthName = monthNames[month];
      const endMonthName = monthNames[Math.min(month + 1, 11)]; // +1 pour le 2ème mois
      return `${startMonthName} - ${endMonthName} ${year}`;
   };

   console.log("sortedWeights:", sortedWeights);
   console.log(
      "Timestamps:",
      sortedWeights.map((w) => ({ date: w.date, timestamp: w.timestamp }))
   );

   return (
      <div>
         <h1 className="text-2xl mb-3 px-1 text-primary flex items-center gap-2">
            Statistiques de poids
         </h1>

         {/* Navigation des trimestres */}
         <div className="flex items-center justify-between mb-4">
            <button
               onClick={goToPreviousMonth}
               disabled={currentMonth === 0}
               className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
               ← Précédent
            </button>
            <span className="text-lg font-semibold">
               {getMonthLabel(currentMonth)}
            </span>
            <button
               onClick={goToNextMonth}
               disabled={currentMonth === 10}
               className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
               Suivant →
            </button>
         </div>

         {/* Graphique Shadcn/ui Chart */}
         <div className="mb-8">
            <Card>
               <CardHeader>
                  <CardTitle>Suivi de poids</CardTitle>
                  <CardDescription>
                     Évolution du poids dans le temps
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <ChartContainer
                     data={sortedWeights}
                     config={{
                        poids: {
                           label: "Poids",
                           color: "hsl(var(--chart-1))",
                        },
                     }}
                     className="h-[300px]"
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

         {/* Liste brute (optionnelle) */}
         {allWeights.map((weight) => (
            <div key={weight.id}>
               <p>{weight.poids}</p>
               <p>{weight.date}</p>
            </div>
         ))}
      </div>
   );
}

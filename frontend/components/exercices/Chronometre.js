"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayIcon, PauseIcon, RotateCcwIcon } from "lucide-react";

export default function Chronometre() {
   const [time, setTime] = useState(0);
   const [isRunning, setIsRunning] = useState(false);
   const intervalRef = useRef(null);

   useEffect(() => {
      if (isRunning) {
         intervalRef.current = setInterval(() => {
            setTime((prevTime) => prevTime + 0.01);
         }, 10);
      } else {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
         }
      }

      return () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
         }
      };
   }, [isRunning]);

   const startTimer = () => {
      setIsRunning(true);
   };

   const pauseTimer = () => {
      setIsRunning(false);
   };

   const resetTimer = () => {
      setIsRunning(false);
      setTime(0);
   };

   const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      const hundredths = Math.floor((seconds % 1) * 100);
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
         .toString()
         .padStart(2, "0")}.${hundredths.toString().padStart(2, "0")}`;
   };

   return (
      <Card className="w-full max-w-md mx-auto">
         {/* <CardHeader>
            <CardTitle className="text-center">Chronomètre</CardTitle>
         </CardHeader> */}
         <CardContent className="space-y-6">
            {/* Affichage du temps */}
            <div className="text-center">
               <div className="text-6xl font-mono font-bold text-primary mb-4">
                  {formatTime(time)}
               </div>
            </div>

            {/* Boutons de contrôle */}
            <div className="flex justify-center gap-4">
               {!isRunning ? (
                  <Button
                     onClick={startTimer}
                     className="bg-green-600 hover:bg-green-700"
                     size="lg"
                  >
                     <PlayIcon className="w-5 h-5" />
                  </Button>
               ) : (
                  <Button
                     onClick={pauseTimer}
                     className="bg-yellow-600 hover:bg-yellow-700"
                     size="lg"
                  >
                     <PauseIcon className="w-5 h-5" />
                  </Button>
               )}

               <Button
                  onClick={resetTimer}
                  variant="outline"
                  size="lg"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
               >
                  <RotateCcwIcon className="w-5 h-5" />
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}

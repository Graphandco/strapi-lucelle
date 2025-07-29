"use client";

import { useExercices } from "@/contexts/ExerciceContext";

export default function ExercicesList() {
   const { allExercices, exerciceTypes } = useExercices();
   console.log(exerciceTypes);
   console.log(allExercices);

   return (
      <div>
         {exerciceTypes.map((type) => (
            <div key={type.id}>{type.name}</div>
         ))}
      </div>
   );
}

"use client";

import { useExercices } from "@/contexts/ExerciceContext";
import Image from "next/image";

export default function ExercicesList() {
   const { allExercices, exerciceTypes } = useExercices();
   console.log(exerciceTypes);
   console.log(allExercices);

   return (
      <div>
         {exerciceTypes.map((type) => (
            <div key={type.id}>
               <span>{type.name}</span>
               <Image
                  src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${type.image.formats.thumbnail.url}`}
                  alt={type.name}
                  className="filter brightness-0 invert"
                  width={100}
                  height={100}
               />
            </div>
         ))}
      </div>
   );
}

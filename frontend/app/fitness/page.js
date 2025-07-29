import PageTitle from "@/components/PageTitle";
import ExercicesList from "@/components/exercices/ExercicesList";
import Chronometre from "@/components/exercices/Chronometre";

export default function Fitness() {
   return (
      <div>
         <PageTitle title="Fitness" />
         <ExercicesList />
         {/* <Chronometre /> */}
      </div>
   );
}

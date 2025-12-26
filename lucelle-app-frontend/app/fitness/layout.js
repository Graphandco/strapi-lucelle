import Chronometre from "@/components/exercices/Chronometre";

export default function FitnessLayout({ children }) {
   return (
      <div className="flex flex-col justify-between grow">
         <div className="grow">{children}</div>
         <Chronometre />
      </div>
   );
}

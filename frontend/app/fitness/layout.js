import Chronometre from "@/components/exercices/Chronometre";

export default function FitnessLayout({ children }) {
   return (
      <div className="flex flex-col justify-between h-full grow">
         <div className="grow">{children}</div>
         <Chronometre />
      </div>
   );
}

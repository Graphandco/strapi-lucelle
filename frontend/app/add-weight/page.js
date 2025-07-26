import PageTitle from "@/components/PageTitle";
import AddWeightForm from "@/components/poids/AddWeightForm";

export const metadata = {
   title: "Ajouter une mesure de poids | Graph and Shop",
};

export default function AddWeight() {
   return (
      <div className="">
         <PageTitle title="Ajouter un poids" />
         <AddWeightForm />
      </div>
   );
}

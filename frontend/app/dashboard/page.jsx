import PageTitle from "@/components/PageTitle";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardProducts from "@/components/dashboard/DashboardProducts";

export const metadata = {
   title: "Tableau de bord | Graph and Shop",
};

export default function DashboardPage() {
   return (
      <div className="flex flex-col items-center">
         <PageTitle title="Tableau de bord" center />
         <DashboardHeader />

         <DashboardProducts />
      </div>
   );
}

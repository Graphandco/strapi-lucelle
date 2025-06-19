import Inventaire from "@/components/products/Inventaire";

export const metadata = {
   title: "Inventaire | Graph and Shop",
};

export default function InventairePage() {
   return (
      <div className="grid gap-8">
         <Inventaire />
      </div>
   );
}

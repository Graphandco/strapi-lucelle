import PageTitle from "@/components/PageTitle";
import AddProductForm from "@/components/products/AddProductForm";

export const metadata = {
   title: "Ajouter un produit | Graph and Shop",
};

export default function AddProduct() {
   return (
      <div className="">
         <PageTitle title="Ajouter un produit" />
         <AddProductForm />
      </div>
   );
}

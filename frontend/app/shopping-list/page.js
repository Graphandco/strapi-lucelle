import {
   getStrapiProductsInCart,
   getStrapiProductsNotInCart,
} from "@/actions/getProducts";

export default async function ShoppingList() {
   const productsInCart = await getStrapiProductsInCart("products");
   const productsNotInCart = await getStrapiProductsNotInCart("products");

   return (
      <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4">Liste de courses</h1>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
               <h2 className="text-xl font-semibold mb-2">Dans le panier</h2>
               <ul className="rounded-lg shadow p-4 space-y-2">
                  {productsInCart && productsInCart.length > 0 ? (
                     productsInCart.map((product) => (
                        <li
                           key={product.id}
                           className="border-b last:border-b-0 py-2"
                        >
                           {product.name}{" "}
                           <span className="">x{product.quantity}</span>
                        </li>
                     ))
                  ) : (
                     <li className="text-gray-400">
                        Aucun produit dans le panier.
                     </li>
                  )}
               </ul>
            </div>
            <div>
               <h2 className="text-xl font-semibold mb-2">À acheter</h2>
               <ul className="rounded-lg shadow p-4 space-y-2">
                  {productsNotInCart && productsNotInCart.length > 0 ? (
                     productsNotInCart.map((product) => (
                        <li
                           key={product.id}
                           className="border-b last:border-b-0 py-2"
                        >
                           {product.name}{" "}
                           <span className="">x{product.quantity}</span>
                        </li>
                     ))
                  ) : (
                     <li className="text-gray-400">Aucun produit à acheter.</li>
                  )}
               </ul>
            </div>
         </div>
      </div>
   );
}

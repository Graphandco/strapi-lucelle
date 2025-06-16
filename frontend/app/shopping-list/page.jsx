import {
   getStrapiProducts,
   getStrapiProductsInCart,
   getStrapiProductsNotInCart,
   getStrapiProductsToBuy,
   getStrapiProductsNotToBuy,
} from "@/actions/getProducts";

export default async function ShoppingList() {
   const products = await getStrapiProducts("products");
   const productsInCart = await getStrapiProductsInCart("products");
   const productsNotInCart = await getStrapiProductsNotInCart("products");
   const productsToBuy = await getStrapiProductsToBuy("products");
   const productsNotToBuy = await getStrapiProductsNotToBuy("products");
   console.log("products", products);
   console.log("productsInCart", productsInCart);
   console.log("productsNotInCart", productsNotInCart);
   console.log("productsToBuy", productsToBuy);
   console.log("productsNotToBuy", productsNotToBuy);
   return (
      <div>
         <h1>Shopping List</h1>
      </div>
   );
}

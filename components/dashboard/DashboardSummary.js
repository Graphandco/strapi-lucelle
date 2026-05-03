export default function DashboardSummary({
   allProducts,
   productsToBuy,
   productsInCart,
}) {
   return (
      <div className="bg-card rounded-lg mt-10 p-3 w-full space-y-3">
         <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <p>Total produits</p>
            <p className="text-primary/50">{allProducts.length}</p>
         </div>
         <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <p>Produits à acheter</p>
            <p className="text-primary/50">{productsToBuy.length}</p>
         </div>
         <div className="flex items-center justify-between">
            <p>Produits dans le panier</p>
            <p className="text-primary/50">{productsInCart.length}</p>
         </div>
      </div>
   );
}

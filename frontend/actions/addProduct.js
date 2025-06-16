"use server";

export async function addProduct(formData) {
   const name = formData.get("name");
   const quantity = formData.get("quantity");
   const isInCart = formData.get("isInCart") === "true";
   const isToBuy = formData.get("isToBuy") === "true";
   const category = formData.get("category");
   const token = formData.get("token");

   const product = {
      data: {
         name,
         quantity: parseFloat(quantity),
         isInCart,
         isToBuy,
         category: parseInt(category),
      },
   };

   try {
      const response = await fetch(
         `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(product),
         }
      );

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(
            errorData.error?.message || "Erreur lors de l'ajout du produit"
         );
      }

      return { success: true };
   } catch (error) {
      console.error("Erreur détaillée:", error);
      return { success: false, error: error.message };
   }
}

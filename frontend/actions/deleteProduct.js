"use server";

export async function deleteProduct(documentId, token) {
   try {
      const response = await fetch(
         `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products/${documentId}`,
         {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
         }
      );
      if (!response.ok) {
         let errorMsg = "Erreur lors de la suppression du produit";
         try {
            const text = await response.text();
            if (text) {
               const errorData = JSON.parse(text);
               errorMsg = errorData.error?.message || errorMsg;
            }
         } catch {}
         throw new Error(errorMsg);
      }
      return { success: true };
   } catch (error) {
      console.error("Erreur suppression:", error);
      return { success: false, error: error.message };
   }
}

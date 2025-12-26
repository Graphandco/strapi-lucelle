"use server";

export async function changeProductToBuy(productId, currentStatus, token) {
   try {
      if (!token) {
         throw new Error("No authentication token provided");
      }

      const response = await fetch(
         `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products/${productId}`,
         {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               data: {
                  isToBuy: !currentStatus,
               },
            }),
         }
      );

      if (!response.ok) {
         const errorData = await response.json();
         console.error("Error response:", errorData);
         throw new Error(
            `Failed to update product: ${
               errorData.error?.message || response.statusText
            }`
         );
      }

      return await response.json();
   } catch (error) {
      console.error("Error updating product:", error);
      throw error;
   }
}

export async function changeProductInCart(productId, currentStatus, token) {
   try {
      if (!token) {
         throw new Error("No authentication token provided");
      }

      console.log("Updating product:", { productId, currentStatus });

      const response = await fetch(
         `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products/${productId}`,
         {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               data: {
                  isInCart: !currentStatus,
               },
            }),
         }
      );

      if (!response.ok) {
         const errorData = await response.json();
         console.error("Error response:", errorData);
         throw new Error(
            `Failed to update product: ${
               errorData.error?.message || response.statusText
            }`
         );
      }

      const data = await response.json();
      console.log("Update successful:", data);
      return data;
   } catch (error) {
      console.error("Error updating product:", error);
      throw error;
   }
}

export async function changeProductQuantity(productId, quantity, token) {
   try {
      if (!token) {
         throw new Error("No authentication token provided");
      }

      if (typeof quantity !== "number" || quantity < 0) {
         throw new Error("La quantité doit être un nombre positif");
      }

      const response = await fetch(
         `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products/${productId}`,
         {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               data: {
                  quantity: quantity,
               },
            }),
         }
      );

      if (!response.ok) {
         const errorData = await response.json();
         console.error("Error response:", errorData);
         throw new Error(
            `Failed to update product quantity: ${
               errorData.error?.message || response.statusText
            }`
         );
      }

      const data = await response.json();
      console.log("Quantity update successful:", data);
      return data;
   } catch (error) {
      console.error("Error updating product quantity:", error);
      throw error;
   }
}

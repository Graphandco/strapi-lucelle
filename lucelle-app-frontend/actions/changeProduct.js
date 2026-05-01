"use server";
import { getAuthTokenFromCookie } from "@/lib/auth.server";

export async function changeProductToBuy(productId, currentStatus) {
   try {
      const token = await getAuthTokenFromCookie();
      const baseUrl = process.env.PAYLOAD_INTERNAL_URL;
      if (!token) {
         throw new Error("No authentication token provided");
      }
      if (!baseUrl) {
         throw new Error("PAYLOAD_INTERNAL_URL is not defined");
      }

      const response = await fetch(
         `${baseUrl}/api/products/${productId}`,
         {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               is_to_buy: !currentStatus,
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

export async function changeProductInCart(productId, currentStatus) {
   try {
      const token = await getAuthTokenFromCookie();
      const baseUrl = process.env.PAYLOAD_INTERNAL_URL;
      if (!token) {
         throw new Error("No authentication token provided");
      }
      if (!baseUrl) {
         throw new Error("PAYLOAD_INTERNAL_URL is not defined");
      }

      console.log("Updating product:", { productId, currentStatus });

      const response = await fetch(
         `${baseUrl}/api/products/${productId}`,
         {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               is_in_cart: !currentStatus,
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

export async function changeProductQuantity(productId, quantity) {
   try {
      const token = await getAuthTokenFromCookie();
      const baseUrl = process.env.PAYLOAD_INTERNAL_URL;
      if (!token) {
         throw new Error("No authentication token provided");
      }
      if (!baseUrl) {
         throw new Error("PAYLOAD_INTERNAL_URL is not defined");
      }

      if (typeof quantity !== "number" || quantity < 0) {
         throw new Error("La quantité doit être un nombre positif");
      }

      const response = await fetch(
         `${baseUrl}/api/products/${productId}`,
         {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               quantity,
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

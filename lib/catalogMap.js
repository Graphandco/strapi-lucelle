export function pidKey(id) {
   return id == null ? "" : String(id);
}

/**
 * Mappe une ligne `shopping_list.products` vers le format UI catalogue.
 *
 * @param {object} row
 * @param {Map<string, number>} toBuyQuantityByProductId
 * @param {Set<string>} inCartIds
 * @param {Set<string>} favoriteIds
 */
export function mapCatalogRow(
   row,
   toBuyQuantityByProductId,
   inCartIds,
   favoriteIds,
) {
   const id = row.id;
   const key = pidKey(id);
   const category = row.category
      ? {
           id: String(row.category.id ?? row.category_id),
           name: row.category.name,
        }
      : row.category_id != null
        ? { id: String(row.category_id), name: "—" }
        : null;

   const isToBuy = toBuyQuantityByProductId.has(key);
   const quantity = isToBuy
      ? Math.max(1, Number(toBuyQuantityByProductId.get(key)) || 1)
      : Math.max(1, Number(row.quantity) || 1);

   /** `null` = produit catalogue (`user_id` null en base). */
   const ownerUserId =
      row.user_id != null && String(row.user_id).trim() !== ""
         ? String(row.user_id)
         : null;

   return {
      id,
      documentId: key,
      name: row.name,
      isToBuy,
      isInCart: inCartIds.has(key),
      category,
      quantity,
      /** Quantité catalogue (table `products`), utile quand `isToBuy` est faux. */
      catalogBaseQuantity: Math.max(1, Number(row.quantity) || 1),
      imageUrl: row.image_url ?? null,
      image: null,
      isFavorited: favoriteIds.has(key),
      ownerUserId,
   };
}

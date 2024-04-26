import { itemImageType } from "@/types/item";
import fetchAPI from "@/utils/api/fetchAPI";
import { queryOptions } from "@tanstack/react-query";

/** Get Images of An Item
 * @example Key: ['images', itemId]
 */
export const imagesFetchOptions = (itemId: string) => queryOptions<itemImageType[]>({
    queryKey: ['images', itemId],
    queryFn: async () => await fetchAPI(`images/${itemId}`),
})

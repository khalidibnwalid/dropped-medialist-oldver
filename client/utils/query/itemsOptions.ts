import { itemData } from '@/types/item'
import { queryOptions } from '@tanstack/react-query'
import fetchAPI from '../api/fetchAPI'

/** All Items,
 *  @example Key: ['items', listId, { trash: false }] */
export const itemsFetchOptions = (listId: string) => queryOptions<itemData[]>({
    queryKey: ['items', listId, { trash: false }],
    queryFn: async () => await fetchAPI(`items/${listId}?trash=false`),
})

/** Single Item */
export const fetchItemOptions = (itemId: string) => queryOptions({
    queryKey: ['item', itemId],
    queryFn: async () => await fetchAPI(`items/id/${itemId}`),
})


import { itemTag } from '@/types/item'
import { queryOptions } from '@tanstack/react-query'
import fetchAPI from '../api/fetchAPI'

/** All Tags of A List 
 * @example Key: ['tags', listId]
*/
export const tagsFetchOptions = (listId: string) => queryOptions<itemTag[]>({
    queryKey: ['tags', listId],
    queryFn: async () => await fetchAPI(`tags/${listId}`),
})


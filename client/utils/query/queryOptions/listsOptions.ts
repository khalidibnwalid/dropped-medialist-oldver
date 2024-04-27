import { listData } from '@/types/list'
import { queryOptions } from '@tanstack/react-query'
import fetchAPI from '../../api/fetchAPI'

export const allListsKey = ['lists', { trash: false }]
export const trashListsKey = ['lists', { trash: true }]

/** All Lists 
 * @example Key: ['lists', { trash: false }]
*/
export const listsFetchOptions = () => queryOptions<listData[]>({
    queryKey: allListsKey,
    queryFn: async () => await fetchAPI('lists?trash=false'),
})

/** Single List
 * @example Key: ['list', listId]
 */
export const listFetchOptions = (listId: string) => queryOptions<listData>({
    queryKey: ['list', listId],
    queryFn: async () => await fetchAPI(`lists/${listId}`),
})


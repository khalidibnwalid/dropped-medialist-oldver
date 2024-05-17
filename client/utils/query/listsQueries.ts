import { queryClient } from '@/components/pagesComponents/providers'
import { listData } from '@/types/list'
import { queryOptions } from '@tanstack/react-query'
import fetchAPI from '../api/fetchAPI'

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

/** - Edit AllLists Cache wiht a single List's info
 * all lists share the same cache */
export const mutateListCache = (data: listData, type: "edit" | "add" | "delete" /* send to trash*/) => {
    const isDelete = type === "delete";
    const isAdd = type === "add";

    if (queryClient.getQueryData(allListsKey)) // for all lists page
        queryClient.setQueryData(allListsKey, (oldData: listData[]) => {
            const allLists = isAdd ? oldData
                : oldData.filter((list) => list.id !== data.id); //remove the old list
            return isDelete
                ? allLists
                : [...allLists, data].sort((a, b) => a.title.localeCompare(b.title)); //sort based on title
        });

    if (queryClient.getQueryData(trashListsKey)) // for trash page
        queryClient.invalidateQueries({ queryKey: trashListsKey })

    queryClient.setQueryData(['list', data.id], data)
}
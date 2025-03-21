import { queryClient } from '@/components/pagesComponents/providers'
import { itemData } from '@/types/item'
import { queryOptions } from '@tanstack/react-query'
import fetchAPI from '../api/fetchAPI'

export const trashItemsKey = ['items', { trash: true }]

/** All Items,
 *  @example Key: ['items', listId, { trash: false }] */
export const itemsFetchOptions = (listId: string) => queryOptions<itemData[]>({
    queryKey: ['items', listId, { trash: false }],
    queryFn: async () => await fetchAPI(`items/${listId}?trash=false`),
})

/** Single Item */
export const itemFetchOptions = (itemId: string) => queryOptions<itemData>({
    queryKey: ['item', itemId],
    queryFn: async () => await fetchAPI(`items/id/${itemId}`),
})

/** - Edit All Items Cache 
 * all items of a list share the same cache*/
export const mutateItemCache = (data: itemData, type: "edit" | "add" | "delete") => {
    const isDelete = type === "delete";
    const isAdd = type === "add";
    const isEdit = type === "edit";
    const listItemsKey = ['items', data.list_id, { trash: false }];

    if (queryClient.getQueryData(listItemsKey)) // for the list page
        queryClient.setQueryData(listItemsKey, (oldData: itemData[]) => {
            if (isEdit) return oldData.map((item) => item.id === data.id ? data : item)
                
            const allItems = isAdd ? oldData
                : oldData.filter((list) => list.id !== data.id); //remove the old list
            return isDelete
                ? allItems
                : [...allItems, data].sort((a, b) => a.title.localeCompare(b.title)); //sort based on title
        });

    if (queryClient.getQueryData(trashItemsKey)) // for trash page
        queryClient.invalidateQueries({ queryKey: trashItemsKey })

    queryClient.setQueryData(['item', data.id], data)
}
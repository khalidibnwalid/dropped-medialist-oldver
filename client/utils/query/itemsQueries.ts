import { itemData } from '@/types/item'
import { queryOptions } from '@tanstack/react-query'
import fetchAPI from '../api/fetchAPI'
import { queryClient } from '@/components/pagesComponents/providers'

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
    const listItemsKey = ['items', data.list_id, { trash: false }];

    if (queryClient.getQueryData(listItemsKey)) // for the list page
        queryClient.setQueryData(listItemsKey, (oldData: itemData[]) => {
            const allItems = isAdd ? oldData
                : oldData.filter((list) => list.id !== data.id); //remove the old list
            return isDelete
                ? allItems
                : [...allItems, data].sort((a, b) => a.title.localeCompare(b.title)); //sort based on title
        });

    !isDelete
        ? queryClient.setQueryData(['item', data.id], data)
        : queryClient.removeQueries({ queryKey: ['item', data.id] });
};
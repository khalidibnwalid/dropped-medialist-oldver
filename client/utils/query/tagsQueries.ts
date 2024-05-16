import { itemTag } from '@/types/item'
import { queryOptions } from '@tanstack/react-query'
import fetchAPI from '../api/fetchAPI'
import { queryClient } from '@/components/pagesComponents/providers'

/** All Tags of A List 
 * @example Key: ['tags', listId]
*/
export const tagsFetchOptions = (listId: string) => queryOptions<itemTag[]>({
    queryKey: ['tags', listId],
    queryFn: async () => await fetchAPI(`tags/${listId}`),
})

/** - Edit All Tags Cache */
export const mutateTagCache = (data: itemTag, type: "edit" | "add" | "delete") => {
    const isDelete = type === "delete";
    const isAdd = type === "add";
    const tagsKey = ['tags', data.list_id];

    queryClient.setQueryData(tagsKey, (oldData: itemTag[]) => {
        const allTags = isAdd ? oldData
            : oldData.filter((tag) => tag.id !== data.id); //remove the old image
        return isDelete ? allTags : [...allTags, data];
    });
};
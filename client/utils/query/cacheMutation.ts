import { queryClient } from "@/components/pagesComponents/providers";
import { listData } from "@/types/list";
import { allListsKey } from "./listsOptions";
import { itemData } from "@/types/item";

/** - Edit AllLists Cache
 * - Edit/Add List Cache*/
export const mutateListCache = (data: listData, type: "edit" | "add" | "delete") => {
    const isDelete = type === "delete"
    const isAdd = type === "add"

    if (queryClient.getQueryData(allListsKey)) // for all lists page
        queryClient.setQueryData(allListsKey, (oldData: listData[]) => {
            const allLists = isAdd ? oldData
                : oldData.filter((list) => list.id !== data.id) //remove the old list
            return isDelete
                ? allLists
                : [...allLists, data].sort((a, b) => a.title.localeCompare(b.title)) //sort based on title
        })
    !isDelete && queryClient.setQueryData(['list', data.id], data)
}

export const mutateItemCache = (data: itemData, type: "edit" | "add" | "delete") => {
    const isDelete = type === "delete"
    const isAdd = type === "add"
    const listItemsKey = ['items', data.list_id, { trash: false }]

    if (queryClient.getQueryData(listItemsKey)) // for the list page
        queryClient.setQueryData(listItemsKey, (oldData: itemData[]) => {
            const allItems = isAdd ? oldData
                : oldData.filter((list) => list.id !== data.id) //remove the old list
            return isDelete
                ? allItems
                : [...allItems, data].sort((a, b) => a.title.localeCompare(b.title)) //sort based on title
        })

    !isDelete && queryClient.setQueryData(['item', data.id], data)
}
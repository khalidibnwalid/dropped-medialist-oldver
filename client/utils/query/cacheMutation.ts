import { queryClient } from "@/components/pagesComponents/providers";
import { listData } from "@/types/list";
import { allListsKey } from "./queryOptions/listsOptions";
import { itemData, itemImageType, itemTag } from "@/types/item";

/** - Edit AllLists Cache
 * - Edit/Add List Cache */
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
    !isDelete
        ? queryClient.setQueryData(['list', data.id], data)
        : queryClient.removeQueries({ queryKey: ['list', data.id] })
}

/** - Edit AllLists Cache
 * - Edit/Add Item Cache */
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

    !isDelete
        ? queryClient.setQueryData(['item', data.id], data)
        : queryClient.removeQueries({ queryKey: ['item', data.id] })
}

/** - Edit All Images Cache */
export const mutateImageCache = (data: itemImageType, type: "edit" | "add" | "delete") => {
    const isDelete = type === "delete"
    const isAdd = type === "add"
    const imagesKey = ['images', data.item_id]

    queryClient.setQueryData(imagesKey, (oldData: itemImageType[]) => {
        const allImages = isAdd ? oldData
            : oldData.filter((image) => image.id !== data.id) //remove the old image
        return isDelete ? allImages : [...allImages, data]
    })
}

/** - Edit All Tags Cache */
export const mutateTagCache = (data: itemTag, type: "edit" | "add" | "delete") => {
    const isDelete = type === "delete"
    const isAdd = type === "add"
    const tagsKey = ['tags', data.list_id]

    queryClient.setQueryData(tagsKey, (oldData: itemTag[]) => {
        const allTags = isAdd ? oldData
            : oldData.filter((tag) => tag.id !== data.id) //remove the old image
        return isDelete ? allTags : [...allTags, data]
    })
}

//on delete it should also check the trash and edit its cache (only for lists and items)
import { queryClient } from "@/components/pagesComponents/providers";
import { itemImageType } from "@/types/item";
import fetchAPI from "@/utils/api/fetchAPI";
import { queryOptions } from "@tanstack/react-query";

/** Get Images of An Item
 * @example Key: ['images', itemId]
 */
export const imagesFetchOptions = (itemId: string) => queryOptions<itemImageType[]>({
    queryKey: ['images', itemId],
    queryFn: async () => await fetchAPI(`images/${itemId}`),
});
/** - Edit All Images Cache */


export const mutateImagesCache = (data: itemImageType, type: "edit" | "add" | "delete") => {
    const isDelete = type === "delete";
    const isAdd = type === "add";
    const imagesKey = ['images', data.item_id];

    queryClient.setQueryData(imagesKey, (oldData: itemImageType[]) => {
        const allImages = isAdd ? oldData
            : oldData.filter((image) => image.id !== data.id); //remove the old image
        return isDelete ? allImages : [...allImages, data];
    });
};
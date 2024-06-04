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
    const imagesKey = ['images', data.item_id];
    const isDelete = type === "delete";
    const isAdd = type === "add";
    const isEdit = type === "edit";

    queryClient.setQueryData(imagesKey, (oldData: itemImageType[]) => {
        if (isEdit) return oldData.map((image) => image.id === data.id ? data : image)

        const allImages = isAdd ? oldData
            : oldData.filter((image) => image.id !== data.id); //remove the old image
        return isDelete ? allImages : [...allImages, data];
    });
};
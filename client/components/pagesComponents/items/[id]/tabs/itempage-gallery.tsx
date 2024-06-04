import type { itemData, itemImageType } from "@/types/item";
import deleteAPI from "@/utils/api/deleteAPI";
import { mutateImagesCache } from "@/utils/query/imagesQueries";
import { useMutation } from "@tanstack/react-query";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { AddImageGalleryButton } from "./addImage-button";
import ImageCard from "./image-card";

function ItemPageGallery({ imageArray, item }: { imageArray: itemImageType[], item: itemData }) {
    const deleteMutation = useMutation({
        mutationFn: (imageID: itemImageType['id']) => deleteAPI(`images/${imageID}`),
        onSuccess: (data) => mutateImagesCache(data, "delete")
    })

    return (
        <ResponsiveMasonry
            className=" px-2"
            columnsCountBreakPoints={imageArray?.length <= 2
                ? { 350: 1, 750: 2 }
                : { 350: 1, 750: 2, 900: 3 }
            }
        >
            <AddImageGalleryButton itemID={item.id} />
            <Masonry>
                {imageArray?.map((image) =>
                    <ImageCard
                        key={image.id}
                        image={image}
                        item={item}
                        deleteMutation={deleteMutation}
                    />
                )}
            </Masonry>
        </ResponsiveMasonry>
    )
}

export default ItemPageGallery;

import { TrashPopover } from "@/components/buttons/trashpop-button";
import type { itemData, itemImageType } from "@/types/item";
import deleteAPI from "@/utils/api/deleteAPI";
import { Button, Card, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { useRouter } from "next/router";
import { BiTrashAlt } from "react-icons/bi";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { AddImageGalleryButton } from "./addImage-button";
import { authContext } from "@/components/pagesComponents/authProvider";
import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { mutateImageCache } from "@/utils/query/cacheMutation";

function ItemPageGallery({ imageArray, item }: { imageArray: itemImageType[], item: itemData }) {
    const { userData } = useContext(authContext)

    const deleteMutation = useMutation({
        mutationFn: (imageID: itemImageType['id']) => deleteAPI(`images/${imageID}`),
        onSuccess: (data) => mutateImageCache(data, "delete")
    })

    return (
        <ResponsiveMasonry
            className=" px-2"
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
        >
            <AddImageGalleryButton itemID={item.id} />
            <Masonry>

                {imageArray?.map((data) =>
                    <Card
                        key={`card of the image ${data.image_path}`}
                        isFooterBlurred
                        radius="lg"
                        className="group border-none m-2 shadow-lg duration-200 rounded-2xl overflow-hidden hover:scale-105"
                    >
                        <CardHeader
                            className="absolute w-fit z-30 top-1 right-1 overflow-hidden  
                                       flex gap-x-2
                                       p-1
                                       border-1 before:bg-white/10 border-white/20
                                       rounded-large before:rounded-xl 
                                       shadow-small 
                                       scale-x-0 group-hover:scale-x-100 duration-150 origin-right"
                        >
                            <TrashPopover
                                onPress={() => deleteMutation.mutate(data.id)}
                            >
                                {({ isTrashOpen }) =>
                                    <Button
                                        className="text-md shadow-sm h-6  aspect-1 rounded-full"
                                        color={isTrashOpen ? 'danger' : 'default'}
                                        variant="light"
                                        isIconOnly
                                    >
                                        <BiTrashAlt />
                                    </Button>
                                }
                            </TrashPopover>
                        </CardHeader>

                        <a href={`${process.env.PUBLIC_IMG_PATH}/users/${userData.id}/images/items/${data.image_path}`} target="_blank">
                            <Image
                                src={`${process.env.PUBLIC_IMG_PATH}/users/${userData.id}/images/items/${data.image_path}`}
                                className="object-contain"
                                alt={data.image_path as string}
                            />
                        </a>

                        {data.title &&
                            <CardFooter
                                className="absolute w-fit z-10 bottom-1 overflow-hidden  
                                       flex gap-x-2
                                       p-[0.35rem] ml-1
                                       border-1 before:bg-white/10 border-white/20
                                       rounded-large before:rounded-xl 
                                       shadow-small "
                            >
                                <p className="text-center text-tiny text-white/80">{data.title}</p>
                            </CardFooter>
                        }
                    </Card>
                )}
            </Masonry>
        </ResponsiveMasonry>
    )
}

export default ItemPageGallery;

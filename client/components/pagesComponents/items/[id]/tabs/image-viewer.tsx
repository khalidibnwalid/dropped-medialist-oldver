import { authContext } from "@/components/pagesComponents/authProvider";
import { itemData, itemImageType } from "@/types/item";
import { Button, Card, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { Dispatch, SetStateAction, useContext } from "react";
import { createPortal } from "react-dom";
import { BiX } from "react-icons/bi";

export default function ImageViewer({
    image,
    item,
    isOpen,
    setIsOpen,
}: {
    image: itemImageType,
    item: itemData,
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) {
    const { userData } = useContext(authContext)

    const originalSrc = `${process.env.PUBLIC_IMG_PATH}/images/${userData.id}/${item.list_id}/${item.id}/${image.image_path}`
    const thumbnailSrc = `${process.env.PUBLIC_IMG_PATH}/images/${userData.id}/${item.list_id}/${item.id}/thumbnails/${image.image_path}.webp`

    return isOpen && createPortal(
        <div
            className="fixed top-0 w-full h-full flex items-center justify-center z-[999]
                      bg-accented/50 backdrop-blur-md animate-fade-in hover:cursor-pointer"
            onClick={() => setIsOpen(false)}
        >
            <Card
                className="group animate-none h-[90%] max-w-[90%] bg-accented/80"
                onClick={e => e.stopPropagation()}
            >
                <CardHeader className="absolute flex gap-x-2 w-fit z-30 top-1 right-1 overflow-hidden p-1">
                    <Button
                        className="flex-none"
                        onClick={() => setIsOpen(false)}
                        isIconOnly
                    >
                        <BiX className="text-2xl" />
                    </Button>
                </CardHeader>

                <Image
                    className="object-contain h-[90vh] max-w-[90vw] w-full"
                    src={thumbnailSrc}
                    alt={"viewImage" + image.id}
                    title="Click to view original image"
                    onClick={() => window.open(originalSrc, "_blank")}
                    onError={() => setIsOpen(false)}
                />

                {(image.title || image.description) && <CardFooter
                    className="absolute opacity-0 group-hover:opacity-100 duration-200 z-10 m-0 bottom-1 pb-2 pt-0 px-4 grid gap-y-2
                            shadow-small border-1 before:bg-white/10 border-white/20 rounded-large bg-accented/20 backdrop-blur-sm ">
                    {image.title && <p className="text-start text-large text-white font-semibold">
                        {image.title}
                    </p>}
                    {image.description && <p className="text-start text-sm text-white/80 ">
                        {image.description}
                    </p>}
                </CardFooter>}
            </Card>
        </div>
        , document.body
    )
}
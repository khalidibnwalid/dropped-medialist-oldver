import { TrashPopover } from "@/components/buttons/trashpop-button";
import SubmitButtonWithIndicators from "@/components/forms/_components/SubmitWithIndicators";
import { authContext } from "@/components/pagesComponents/authProvider";
import { itemData, itemImageType } from "@/types/item";
import patchAPI from "@/utils/api/patchAPI";
import { mutateImagesCache } from "@/utils/query/imagesQueries";
import { Button, ButtonProps, Card, CardFooter, CardHeader, Image, Input } from "@nextui-org/react";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from 'framer-motion';
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { BiPencil, BiTrashAlt, BiX } from "react-icons/bi";
import { FaSave } from "react-icons/fa";
import ImageViewer from "./image-viewer";

export default function ImageCard({
    image,
    item,
    deleteMutation
}: {
    image: itemImageType,
    item: itemData,
    deleteMutation: UseMutationResult<any, Error, itemImageType['id'], unknown>
}) {
    const { userData } = useContext(authContext)

    const [imageIsLoaded, setImageIsLoaded] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const viewMode = !editMode

    const { register, handleSubmit } = useForm<itemImageType>()

    const optionsButtonProps: ButtonProps = {
        className: "text-md shadow-sm h-6 aspect-1 rounded-full",
        variant: "light",
        isIconOnly: true,
    }

    const mutation = useMutation({
        mutationFn: (data: itemImageType) => patchAPI(`images/${image.id}`, data),
        onSuccess: (data) => {
            mutateImagesCache(data, "edit")
            mutation.reset()
            setEditMode(false)
        },
    })
    const onSubmit = (imageData: itemImageType) => mutation.mutate(imageData)

    const originalSrc = `${process.env.PUBLIC_IMG_PATH}/images/${userData.id}/${item.list_id}/${item.id}/${image.image_path}`
    const thumbnailSrc = `${process.env.PUBLIC_IMG_PATH}/images/${userData.id}/${item.list_id}/${item.id}/thumbnails/${image.image_path}_size=700xH.webp`

    return imageIsLoaded && (
        <Card
            className="group border-none m-2 shadow-lg duration-200 rounded-2xl overflow-hidden hover:scale-105"
            radius="lg"
            isFooterBlurred
        >
            {/* onHover options bar & Edit mode */}
            <AnimatePresence>
                {viewMode ?
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                    >
                        <CardHeader className="absolute flex gap-x-2 w-fit z-30 top-1 right-1 overflow-hidden p-1 border-1 bg-accented/35 before:bg-white/10
                         border-white/20 rounded-large before:rounded-xl shadow-small scale-0 group-hover:scale-100 duration-150 origin-center">
                            <Button onPress={() => setEditMode(true)} {...optionsButtonProps} >
                                <BiPencil />
                            </Button>

                            <TrashPopover onPress={() => deleteMutation.mutate(image.id)}>
                                {({ isTrashOpen }) =>
                                    <Button color={isTrashOpen ? 'danger' : 'default'}  {...optionsButtonProps}>
                                        <BiTrashAlt />
                                    </Button>
                                }
                            </TrashPopover>
                        </CardHeader>
                    </motion.div>
                    : <motion.div
                        key={image.id + 'edit'}
                        className=" grid gap-y-1 w-full overflow-hidden"
                        transition={{ duration: 0.2 }}
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                    >
                        <Input
                            aria-label="Tag's Name"
                            className=" px-2 pt-3"
                            variant="flat"
                            size="sm"
                            label=""
                            labelPlacement="outside"
                            placeholder="Title"
                            defaultValue={image?.title}
                            {...register("title")}
                        />

                        <Input
                            aria-label="Tag's Name"
                            className="px-2"
                            variant="flat"
                            size="sm"
                            label=""
                            labelPlacement="outside"
                            placeholder="Enter Description"
                            defaultValue={image?.description}
                            {...register("description")}
                        />

                        <div className="flex gap-x-1 w-full px-2 pb-3">
                            <SubmitButtonWithIndicators
                                mutation={mutation}
                                onClick={handleSubmit(onSubmit)}
                                saveContent={<><FaSave className=" text-xl" /> Save Edit </>}
                                className="flex-grow"
                                size="sm"
                            />
                            <Button
                                type="button"
                                size="sm"
                                className=" text-2xl"
                                onPress={() => setEditMode(false)}
                                isIconOnly
                            >
                                <BiX />
                            </Button>
                        </div>
                    </motion.div>
                }
            </AnimatePresence>

            {/* <a href={originalSrc} target="_blank"> */}
            <Image
                className="object-contain hover:cursor-pointer"
                alt={image?.title || image.image_path as string}
                src={thumbnailSrc}
                onClick={() => setIsOpen(b => !b)}
                onError={() => setImageIsLoaded(false)}
            />
            {/* </a> */}
            <ImageViewer image={image} item={item} isOpen={isOpen} setIsOpen={setIsOpen} />

            {viewMode && image.title &&
                <CardFooter className="absolute w-fit max-w-[95%] z-10 bottom-1 overflow-hidden flex gap-x-2 p-1 scroll ml-1 shadow-small
                                          border-1 before:bg-white/10 border-white/20 rounded-large before:rounded-xl">
                    <p className="text-center text-tiny text-white/80">{image.title}</p>
                </CardFooter>
            }
        </Card>
    )
}
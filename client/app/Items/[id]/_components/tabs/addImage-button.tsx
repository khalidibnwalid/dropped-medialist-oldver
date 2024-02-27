'use client'

import SingleImageUploader from "@/components/forms/single-imageUploader";
import type { itemImageType } from "@/types/item";
import handleImageUpload from "@/utils/api/handlers/handleImageUpload";
import postAPI from "@/utils/api/postAPI";
import { dateStamped } from "@/utils/helper-functions/dateStamped";
import getFileExtension from "@/utils/helper-functions/getFileExtinsion";
import sanitizeObject from "@/utils/helper-functions/sanitizeObject";
import { Button, Card, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { BiX } from "react-icons/bi";
import { LuImagePlus } from "react-icons/lu";

export const AddImageGalleryButton = ({ itemID }: { itemID: string }) => {
    const [editMode, setEditMode] = useState(false)
    const router = useRouter();

    const { register, handleSubmit, control, setValue } = useForm<itemImageType>()

    const onSubmit: SubmitHandler<itemImageType> = (rawData) => {
        const { rawImage, ...data }: any = rawData
        sanitizeObject(data)
        setEditMode(false)
        
        const imageName = dateStamped(`.${getFileExtension(rawImage[0].file.name)}`)
        handleImageUpload(rawImage, "items", imageName); //remove true
        data['image_path'] = imageName;

        postAPI(`images/${itemID}`, { body: [data] })

        //reset fields
        setValue('title', undefined)
        setValue('description', undefined)

        router.refresh()
    }
    return (
        <>
            {editMode ?
                <Card className=" bg-accented p-3 duration-200 animate-fade-in">
                    <form
                        className="flex-grow grid grid-cols-1 gap-y-2 animate-fade-in duration-200"
                    >
                        <div className=" flex items-center justify-between gap-x-1">
                            <Button
                                type="button"
                                onClick={handleSubmit(onSubmit)}
                                size="sm"
                                className="p-1 flex-grow">
                                <LuImagePlus className=" text-xl" /> Save Image
                            </Button>
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

                        <SingleImageUploader className="h-24" control={control} fieldName="rawImage" content="Image" required />

                        <div className="flex gap-x-2 items-center">
                            <p className="text-gray-400 font-semibold text-sm flex-grow">Title (optional)</p>
                            <Input
                                variant="bordered"
                                className="flex-grow"
                                size="sm"
                                aria-label="Tag's Name"
                                label=""
                                labelPlacement="outside"
                                {...register("title")}
                            />
                        </div>

                        <Input
                            variant="bordered"
                            className="flex-grow"
                            aria-label="Tag's Name"
                            label=""
                            labelPlacement="outside"
                            placeholder="Enter Description"
                            {...register("description")}
                        />

                    </form>
                </Card>
                :
                <Button
                    radius="lg"
                    onPress={() => setEditMode(true)}
                    className="border-none m-2 shadow-lg duration-200 rounded-2xl overflow-hidden animate-fade-in"
                >
                    <LuImagePlus className=" text-xl" /> Add Image
                </Button>
            }
        </>
    )
}

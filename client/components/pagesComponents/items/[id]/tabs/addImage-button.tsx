import SingleImageUploader, { UploadedImage } from "@/components/forms/_components/Images/single-imageUploader";
import SubmitButtonWithIndicators from "@/components/forms/_components/SubmitWithIndicators";
import type { itemImageType } from "@/types/item";
import postAPI from "@/utils/api/postAPI";
import appendObjKeysToFormData from "@/utils/helperFunctions/form/appendObjKeysToFormData";
import { mutateImagesCache } from "@/utils/query/imagesQueries";
import { Button, Card, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { BiX } from "react-icons/bi";
import { LuImagePlus } from "react-icons/lu";

export const AddImageGalleryButton = ({ itemID }: { itemID: string }) => {
    const [editMode, setEditMode] = useState(false)
    const { register, handleSubmit, control, setValue } = useForm<itemImageType>()

    const mutation = useMutation({
        mutationFn: (formData: FormData) => postAPI(`images/${itemID}`, formData),
        onSuccess: (data) => {
            mutateImagesCache(data, "add")

            //reset fields
            setValue('title', undefined)
            setValue('description', undefined)
            setValue('image_path', undefined as any)
            mutation.reset()
            setEditMode(false)
        },
    })

    const onSubmit = (rawData: itemImageType) => {
        if (!(rawData.image_path as UploadedImage)?.[0]?.file) return

        type omitData = Omit<itemImageType, 'image_path'>;
        const { image_path, ...data }: itemImageType = rawData

        const formData = new FormData();
        appendObjKeysToFormData(formData, data as omitData)
        formData.append('image_path', ((image_path as UploadedImage)[0].file))

        mutation.mutate(formData)
    }

    return editMode ? (
        <Card className=" bg-accented p-3 duration-200 animate-fade-in">
            <form className="flex-grow grid grid-cols-1 gap-y-2 animate-fade-in duration-200">
                <div className=" flex items-center justify-between gap-x-1">
                    <SubmitButtonWithIndicators
                        mutation={mutation}
                        onClick={handleSubmit(onSubmit)}
                        saveContent={<><LuImagePlus className=" text-xl" /> Save Image </>}
                        className="p-1 flex-grow"
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

                <SingleImageUploader className="h-24" control={control} fieldName="image_path" content="Image" required />

                <div className="flex gap-x-2 items-center">
                    <label className="text-gray-400 font-semibold text-sm flex-grow">Title (optional)</label>
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
    ) : (
        <Button
            radius="lg"
            onPress={() => setEditMode(true)}
            className="border-none m-2 shadow-lg duration-200 rounded-2xl overflow-hidden animate-fade-in"
        >
            <LuImagePlus className=" text-xl" /> Add Image
        </Button>
    )
}

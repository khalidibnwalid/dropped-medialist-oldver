'use client'
import SingleImageUploader from "@/components/forms/single-imageUploader";
import { Button, Card } from "@nextui-org/react";
import { useState } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { UseFormResetField } from 'react-hook-form';
import { BiX } from "react-icons/bi";
type params = {
    control: Control<any>;
    fieldName: string;
    resetField: UseFormResetField<any>
    className?: string;
    content?: string;
    required?: boolean;
    setValue: UseFormSetValue<any>
    imgSrc?: string; //should be passed as {collectionData.cover_path ?`${IMG_PATH}/images/collections/${collectionData.cover_path}` : undefined}
}

function SingleImageUploaderDefault({
    control,
    fieldName,
    content,
    required,
    resetField,
    setValue,
    className = 'aspect-1',
    imgSrc = undefined
}: params) {

    const [uploadImageState, setUploadImageState] = useState(() => {
        if (imgSrc) { return false } else { return true }
    });

    return (
        <>
            {imgSrc ?
                (uploadImageState ?
                    <div className={`${className} grid w-full h-full animate-fade-in `}>
                        <SingleImageUploader
                            control={control}
                            fieldName={fieldName}
                            className={` ${className} w-full`}
                            content={content}
                            required={required}
                        />
                        <Button
                            className="w-full mt-3"
                            type="button"
                            onClick={() => {
                                setUploadImageState(false);
                                resetField(fieldName)
                            }}
                        >
                            <BiX className="text-3xl" /> Back
                        </Button>
                    </div>
                    :
                    <Card className={`${className} flex items-center justify-center mb-5
                                             shadow-perfect-md object-cover overflow-hidden 
                                             border-5 border-[#282828] animate-fade-in `}
                    >
                        <div className="w-full h-full">
                            <img
                                src={imgSrc}
                                className="-z-10 w-full object-cover filter object-center"
                                alt="poster-uploadimage"
                            />
                            <div className="absolute bottom-0 flex justify-end gap-x-2 p-2 w-full">
                                <Button type="button"
                                    onClick={() => {
                                        setUploadImageState(true)
                                        setValue<any>(fieldName, null) // null = remove the photo
                                    }}
                                    isIconOnly
                                >
                                    <BiX className="text-3xl" />
                                </Button>
                            </div>
                        </div>
                    </Card>)
                :
                <SingleImageUploader
                    control={control}
                    fieldName={fieldName}
                    className={className}
                    content={content}
                    required={required}
                />
            }
        </>
    )
}


export default SingleImageUploaderDefault
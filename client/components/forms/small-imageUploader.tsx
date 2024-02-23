'use client'

import { Button, Card } from "@nextui-org/react";
import type { DefaultValues } from "react-hook-form";
import { Control, Controller } from 'react-hook-form';
import { BiX } from "react-icons/bi";
import { LuImagePlus } from "react-icons/lu";
import ImageUploading from "react-images-uploading";


type params = {
    control: Control<any>;
    fieldName: string;
    className?: string;
    disabled?: boolean
    defaultValue?: DefaultValues<any>
    key?: string
}

function SmallImageUploader({ control, fieldName, className, disabled, key }: params) {
    return (
        <div className={className}>
            <Controller
                name={fieldName}
                control={control}
                render={({ field: { value, onChange } }) => (
                    <ImageUploading
                        value={value}
                        acceptType={['jpg', 'png', 'jpeg', 'webp', "svg"]}
                        onChange={onChange}>
                        {({
                            imageList,
                            onImageUpload,
                            onImageRemoveAll,
                            onImageUpdate,
                            onImageRemove,
                            isDragging,
                            dragProps
                        }) => (
                            // type="button"
                            <div className="upload__image-wrapper h-full">
                                {imageList.length == 0 && (
                                    <Card
                                        isDisabled={disabled}
                                        isPressable
                                        className="flex items-center justify-center mb-5 h-full w-full 
                                       shadow-perfect-md bg-[#282828] object-cover
                                       duration-100 hover:bg-[#303030]"
                                        style={isDragging ? { backgroundColor: "#005BC4" } : undefined}
                                        onPress={onImageUpload}
                                        {...dragProps}>
                                        <LuImagePlus className="text-2xl" />
                                    </Card>)}

                                {imageList.length !== 0 && (
                                    <div className="h-full w-full">
                                        {imageList.map((image, index) => (
                                            <div key={index} className="image-item w-full h-full image-item__btn-wrapper">
                                                <Button
                                                    type="button"
                                                    onClick={() => onImageRemove(index)}
                                                    className="bg-[#282828] h-full w-full hover:bg-[#303030] duration-100"
                                                    isIconOnly
                                                >
                                                    <BiX className="text-2xl" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                        }
                    </ImageUploading>
                )} />
        </div>
    );
}


export default SmallImageUploader;
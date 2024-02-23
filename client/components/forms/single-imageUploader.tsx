'use client'

import { Button, Card } from "@nextui-org/react";
import { Control, Controller } from 'react-hook-form';
import { BiX } from "react-icons/bi";
import ImageUploading from "react-images-uploading";

type params = {
    control: Control<any>;
    fieldName: string;
    className?: string;
    content?: string;
    required?: boolean;
}

function SingleImageUploader({ control, fieldName, className, content, required }: params) {
    //add url input

    return (
        <div className={className}>
            <Controller
                name={fieldName}
                control={control}
                rules={{ required: required }}
                render={({ field: { value, onChange } }) => (
                    <ImageUploading
                        value={value}
                        acceptType={['jpg', 'png', 'jpeg', 'webp', "svg"]}
                        onChange={onChange}
                    >
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
                                        isPressable
                                        className="flex items-center justify-center mb-5 h-full w-full 
                                       shadow-perfect-md bg-[#282828] object-cover
                                       duration-100 hover:bg-[#303030]"
                                        style={isDragging ? { backgroundColor: "#005BC4" } : undefined}
                                        onPress={onImageUpload}
                                        {...dragProps}>
                                        <p> Click or Drop <b>{content}</b> Here </p>
                                    </Card>)}

                                {imageList.length !== 0 && (
                                    <Card className="flex items-center justify-center mb-5 h-full w-full 
                                             shadow-perfect-md object-cover overflow-hidden 
                                             border-5 border-[#282828]">
                                        {imageList.map((image, index) => (
                                            <div key={index} className="image-item w-full h-full">
                                                <img src={image.dataURL} className="-z-10 w-full object-cover filter object-center" alt="poster-uploadimage" />
                                                <div className="image-item__btn-wrapper absolute bottom-0 flex justify-end gap-x-2 p-2 w-full">
                                                    <Button type="button" onClick={() => onImageRemove(index)} isIconOnly><BiX className="text-3xl" /></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </Card>)}
                            </div>
                        )}
                    </ImageUploading>
                )} />
        </div>
    );
}


export default SingleImageUploader;
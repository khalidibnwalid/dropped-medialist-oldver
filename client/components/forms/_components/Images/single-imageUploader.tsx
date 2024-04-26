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
    defaultValue?: { dataURL: string }[]
}

export type UploadedImage = (File & { file: { name: string }, dataURL: string })[]

function SingleImageUploader({ control, fieldName, className, content, required, defaultValue }: params) {

    return (
        <div className={className}>
            <Controller
                name={fieldName}
                defaultValue={defaultValue}
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
                            <div className="upload__image-wrapper h-full">
                                {imageList.length == 0 ? (
                                    <Card
                                        isPressable
                                        className="flex items-center justify-center mb-5 h-full w-full 
                                       shadow-lg bg-accented object-cover
                                       duration-100 hover:bg-default"
                                        style={isDragging ? { backgroundColor: "#005BC4" } : undefined}
                                        onPress={onImageUpload}
                                        {...dragProps}>
                                        <p> Click or Drop <b>{content}</b> Here </p>
                                    </Card>) : (
                                    <Card className="flex items-center justify-center mb-5 h-full w-full 
                                             shadow-lg object-cover overflow-hidden 
                                             border-5 border-accented">
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
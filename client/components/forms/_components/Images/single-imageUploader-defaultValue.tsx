import SingleImageUploader from "@/components/forms/_components/Images/single-imageUploader";
import { Button, Card } from "@nextui-org/react";
import { useState } from "react";
import type { Control, FieldValues, Path, UseFormSetValue } from "react-hook-form";
import { UseFormResetField } from 'react-hook-form';
import { BiX } from "react-icons/bi";

type props<T extends FieldValues> = {
    control: Control<T>;
    fieldName: Path<T>;
    resetField: UseFormResetField<T>
    className?: string;
    content?: string;
    required?: boolean;
    setValue: UseFormSetValue<T>
    imgSrc?: string;
}

function SingleImageUploaderDefault<T extends FieldValues>({
    control,
    fieldName,
    content,
    required,
    resetField,
    setValue,
    className = 'aspect-1',
    imgSrc = undefined
}: props<T>) {

    const [uploadImageState, setUploadImageState] = useState(() => {
        if (imgSrc) { return false } else { return true }
    });

    return imgSrc
        ? (uploadImageState
            ? <div className={`${className} grid w-full h-full animate-fade-in `}>
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
            : <Card className={`${className} flex items-center justify-center mb-5
                                             shadow-lg object-cover overflow-hidden 
                                             border-5 border-accented animate-fade-in `}
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
                                setValue(fieldName, null as any) // null = remove the photo
                            }}
                            isIconOnly
                        >
                            <BiX className="text-3xl" />
                        </Button>
                    </div>
                </div>
            </Card>)
        : <SingleImageUploader
            control={control}
            fieldName={fieldName}
            className={className}
            content={content}
            required={required}
        />
}



export default SingleImageUploaderDefault
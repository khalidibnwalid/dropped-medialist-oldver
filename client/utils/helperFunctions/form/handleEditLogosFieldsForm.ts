import { UploadedImage } from "@/components/forms/_components/Images/single-imageUploader";
import dummyBlobFile from "../dummyBlobFile";

export default function handleEditLogosFieldsForm<T extends { logo_path?: UploadedImage | string }>(
    fieldsArray: T[] | undefined,
    formData: FormData,
    fieldName: string
) {
    formData.delete(fieldName) //to make sure its empty before appending new values

    /** preserveImageBlob asks the server to take the logo_path sent in the fieldsArray */
    const preserveImageBlob = dummyBlobFile(5)
    const deleteImageBlob = dummyBlobFile(4)

    return fieldsArray?.map(field => {
        const { logo_path, ...rest } = field;

        const uploadedLogo = (field.logo_path as UploadedImage)?.[0]?.file

        formData.append(fieldName,
            uploadedLogo //if a new file is uploaded
            || !field.logo_path && deleteImageBlob //if the old File is deleted
            || preserveImageBlob //if the user didn't change the file
        )
        return field
    })
}
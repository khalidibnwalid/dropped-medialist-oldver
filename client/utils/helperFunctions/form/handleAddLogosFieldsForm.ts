import { UploadedImage } from "@/components/forms/_components/Images/single-imageUploader";
import dummyBlobFile from "../dummyBlobFile";

export default function handleAddLogosFieldsForm<T extends { logo_path?: UploadedImage | string }>(
    fieldsArray: T[] | undefined,
    formData: FormData,
    fieldName: string
) {
    formData.delete(fieldName) //to make sure its empty before appending new values

    /** a Dummy Blob to preserve the order of the logosFields (badges and links),
     * so the server can know which has a file and which doesn't 
     * by only comparing the orders of the files and fields */
    const emptyImageBlob = dummyBlobFile()

    return fieldsArray?.map(field => {
        const { logo_path, ...rest } = field;
        formData.append(fieldName, (logo_path as UploadedImage)?.[0]?.file ?? emptyImageBlob);

        /** if logo_path is a string, it means its already uploaded, by using a field template (only inside an item)*/
        if (logo_path && typeof logo_path === 'string') return field
        return rest
    })
}
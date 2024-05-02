import { UploadedImage } from "@/components/forms/_components/Images/single-imageUploader";
import dummyBlobFile from "./dummyBlobFile";

export default function handleLogosFieldsForm<T extends { logo_path: UploadedImage }>(
    fieldsArray: T[],
    formData: FormData,
    fieldName: string
) {
    /** a Dummy Blob to preserve the order of the logosFields (badges and links),
     * so the server can know which has a file and which doesn't 
     * by only comparing the orders of the files and fields */
    const dummyFile = dummyBlobFile()

    formData.delete(fieldName) //to make sure its empty before appending new values

    return fieldsArray?.map(field => {
        const { logo_path, ...rest } = field;
        formData.append(fieldName, logo_path?.[0]?.file ?? dummyFile);
        return rest
    })
}
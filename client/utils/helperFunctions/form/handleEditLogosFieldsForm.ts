import { UploadedImage } from "@/components/forms/_components/Images/single-imageUploader";
import handleEditFileForm from "./handleEditFileForm";

export default function handleEditLogosFieldsForm<T extends { logo_path?: UploadedImage | string }>(
    fieldsArray: T[] | undefined,
    formData: FormData,
    fieldName: string
) {
    formData.delete(fieldName) //to make sure its empty before appending new values

    return fieldsArray?.map(field => {
        const { logo_path } = field;
        handleEditFileForm(logo_path, formData, fieldName)

        return field
    })
}
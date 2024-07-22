import { UploadedImage } from "@/components/forms/_components/Images/single-imageUploader";
import dummyBlobFile from "../dummyBlobFile";

export default function handleEditFileForm(
    file: string | UploadedImage | null | undefined,
    formData: FormData,
    filedName: string
) {
    const preserveImageBlob = dummyBlobFile(5)
    const deleteImageBlob = dummyBlobFile(4)

    let fileToAppend;
    // if the file is a string, it means the user didn't change the file and it still contains the path
    if (typeof file === "string")
        fileToAppend = preserveImageBlob
    else if (file === null) // based on the what I made uploadImage form do on File deletion
        fileToAppend = deleteImageBlob
    else
        fileToAppend = (file as UploadedImage)?.[0]?.file || deleteImageBlob

    formData.append(filedName, fileToAppend)
}
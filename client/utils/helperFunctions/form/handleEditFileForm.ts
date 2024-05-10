import dummyBlobFile from "../dummyBlobFile"

export default function handleEditFileForm(file: File | undefined, formData: FormData, filedName: string) {

    const preserveImageBlob = dummyBlobFile(5)
    const deleteImageBlob = dummyBlobFile(4)

    formData.append(filedName, file || !file && deleteImageBlob || preserveImageBlob)
}
import { File } from "formidable";
import handleFileSaving from "./handleFileSaving";


export const handleLogosFields = async <T extends { logo_path?: string }>(
    fieldsArray: T[],
    filesArray: File[],
    userMediaRoot: { logos: string },
    isTesting?: boolean
): Promise<T[]> => await Promise.all(
    fieldsArray.map(async (field, index) => ({
        ...field,
        logo_path: await handleLogoPath(filesArray[index], userMediaRoot, isTesting)
    }))
) as T[]

const handleLogoPath = async (file: File, userMediaRoot: { logos: string }, isTesting?: boolean) =>
    isDummyBlob(file) ? undefined : await handleFileSaving(file, userMediaRoot.logos, isTesting);

const isDummyBlob = (blob: File) => (blob.size === 5 && blob.mimetype === 'text/plain' && blob.originalFilename === 'blob')
import { File } from "formidable";
import handleFileSaving from "./handleFileSaving";
import { isDummyBlob } from "../helperFunction/isDummyBlob";

/** On POST Requests, 
 * use the default dummyBLob with the size of 5 to preserve the order of the sended files,
 * so the client  only needs to compare between files and fields index to know which file is for who
 * 
 * ### Request Structure:
 * on Post, logosFields formFields won't include the logo_path, just formFiles,
 * */
export const handleLogosFieldsSaving = async <T extends { logo_path?: string }>(
    formFields: T[],
    formFiles: File[],
    dist: string,
    prefix?: string,
    isTesting?: boolean
): Promise<T[]> => await Promise.all(
    formFields.map(async (field, index) => ({
        ...field,
        logo_path: field?.logo_path || await handleLogoCreating(formFiles?.[index], dist, prefix, isTesting)
    }))
) as T[]

const handleLogoCreating = async (file: File | undefined, dist: string, prefix?: string, isTesting?: boolean) =>
    file && !isDummyBlob(file) ? await handleFileSaving(file, dist, prefix, isTesting) : null
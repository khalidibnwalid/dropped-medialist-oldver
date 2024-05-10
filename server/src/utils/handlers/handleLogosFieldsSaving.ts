import { File } from "formidable";
import handleFileSaving from "./handleFileSaving";
import { isDummyBlob } from "./isDummyBlob";

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
    userMediaRoot: { logos: string },
    isTesting?: boolean
): Promise<T[]> => await Promise.all(
    formFields.map(async (field, index) => ({
        ...field,
        logo_path: await handleLogoCreating(formFiles[index], userMediaRoot, isTesting)
    }))
) as T[]

const handleLogoCreating = async (file: File, userMediaRoot: { logos: string }, isTesting?: boolean) =>
    isDummyBlob(file) ? undefined : await handleFileSaving(file, userMediaRoot.logos, isTesting) //returns the path
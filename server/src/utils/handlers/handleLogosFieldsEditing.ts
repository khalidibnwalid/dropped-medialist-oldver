import { File } from "formidable";
import { logosCacheConfigs } from "../cacheConfigs";
import { isDummyBlob } from "../helperFunction/isDummyBlob";
import { deleteFileWithCache } from "./deleteFileFn";
import handleFileSaving from "./handleFileSaving";

/** On PUT / PATCH Requests,
 * the default dummyBLob will be mean that the field's logo is unchanged, so it will use the original path.
 * otherwise, it will upload a new logo, or delete the old one.
 * 
 * ### Request Structure:
 * on PUT / PATCH, logosFields formFields WILL include the origial logo_path,
 *  while formFiles will contain instructions about what to do with them, (i.e preserve, delete, or upload a new one)
 * @param
 * all params are for the field it self, not for the whole list/item */
export default async function handleEditLogosFields<T extends { logo_path?: string; }>(
    dist: string,
    formFields: T[] = [], // 
    formFiles: File[] = [],
    /**to compare the new data with the original data, 
     *  in the case of an item it is the original fileds, 
     * in the lists it is  field templates  */
    originalFields: T[] = [],
    /** all the logos paths from the logos fields of the list's items, to check if they are used or not,
     * only pass it if the type is list */
    itemsLogoPaths?: { logo_path: string }[],
    prefix?: string,
    isTesting?: boolean
): Promise<T[]> {
    const unusedLogos = originalFields.map(
        original => !formFields?.some(f => f.logo_path === original.logo_path) && original.logo_path
    )

    // delete all unused logos
    unusedLogos?.forEach(async (logoPath) => {
        if (!logoPath || logoPath === 'star') return
        const isUsedByAnItem = itemsLogoPaths?.some(i => i.logo_path === logoPath)
        const isUsedByTemplate = !itemsLogoPaths && logoPath.startsWith('template_')
        if (logoPath && !isUsedByAnItem && !isUsedByTemplate && !isTesting)
            await deleteFileWithCache(logosCacheConfigs, dist, logoPath)
    })

    return await Promise.all(
        formFields.map(async (field, index) => {
            let logo_path;

            const logoFile = formFiles[index]
            const isPreserveImageBlob = isDummyBlob(logoFile, 5)
            // isDeleteImageBlob still exist but is only used to preserve index order sync of formFields and formFiles

            // The request formFields form will include the original path
            const originalLogoPath = formFields[index]?.logo_path
                ? String(formFields[index]?.logo_path) //for security reasons
                : null

            logo_path = isPreserveImageBlob
                ? originalLogoPath
                : await handleFileSaving(formFiles[index], dist, logosCacheConfigs, prefix, isTesting)

            return { ...field, logo_path }
        })
    ) as T[];
}

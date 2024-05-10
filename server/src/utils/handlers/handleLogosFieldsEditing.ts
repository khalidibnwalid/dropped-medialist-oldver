import { File } from "formidable";
import fs from 'fs';
import path from "path";
import handleFileSaving from "./handleFileSaving";
import { isDummyBlob } from "./isDummyBlob";

/** On PUT / PATCH Requests,
 * the default dummyBLob will be mean that the field's logo is unchanged, so it will use the original path.
 * a dummy blob with the size of (4) will mean that the field's logo is removed, so it will be deleted.
 * any other file will be considered as a new logo, so it will be saved and the path will be returned.
 * 
 * ### Request Structure:
 * on PUT / PATCH, logosFields formFields WILL include the origial logo_path,
 *  while formFiles will contain instructions about what to do with them, (i.e preserve, delete, or upload a new one)
 * @param
 * all params are for the field it self, not for the whole list
 * */
export default async function handleEditLogosFields<T extends { logo_path?: string; }>(
    /** is the function is called to edit a list or an item */
    type: 'list' | 'item',
    userMediaRoot: { logos: string; },
    formFields: T[] = [], // 
    formFiles: File[] = [],
    /** all the logos paths from the logos fields of the list's items, to check if they are used or not */
    itemsLogoPaths: { logo_path: string }[] = [],
    /** pass the original pre-edit fieldTemplate of the field *(not the whole list's fieldTemplates)*,
     * in a list it will be used to compare old & new data,
     * in an item it is needed to check whether a logo is using a template, to avoid deleting a template's logo*/
    fieldTemplate: T[] = [],
    /**to compare the new data with the original data, 
     *  in the case of an item it is the original fileds, 
     * in the lists it is the fieldTemplates  */
    originalFields: T[] = fieldTemplate,
    isTesting?: boolean
): Promise<T[]> {

    async function deleteLogo(logoPath?: string, isUsedByAnItem?: boolean, isUsedByTemplate?: boolean) {
        // it shouldn't delete an unexisting logo nor a used one
        if (logoPath === 'star') return
        if (logoPath && !isUsedByAnItem && !(isUsedByTemplate && type === 'item') && !isTesting) {
            try {
                const filePath = path.join(userMediaRoot.logos, logoPath)
                await fs.promises.unlink(filePath)
            } catch (e) {
                console.log('[Error] deleting ' + logoPath, e)
            }
        }
    }

    const unusedLogos = originalFields.map(
        original => !formFields?.some(f => f.logo_path === original.logo_path) && original.logo_path
    )

    // delete all unused logos
    unusedLogos?.forEach(async (logoPath) => {
        if (!logoPath) return
        if (logoPath === 'star') return
        const isUsedByAnItem = itemsLogoPaths.some(i => i.logo_path === logoPath)
        const isUsedByTemplate = fieldTemplate.some(f => f.logo_path === logoPath)
        await deleteLogo(logoPath, isUsedByAnItem, isUsedByTemplate)
    })

    return await Promise.all(
        formFields.map(async (field, index) => {
            let logo_path;

            const logoFile = formFiles[index]
            const isPreserveImageBlob = isDummyBlob(logoFile, 5)
            const isDeleteImageBlob = isDummyBlob(logoFile, 4)
            // The request formFields form will include the original path
            const originalLogoPath = formFields[index]?.logo_path
                ? String(formFields[index]?.logo_path) //for security reasons
                : null

            if (isPreserveImageBlob) logo_path = originalLogoPath
            if (isDeleteImageBlob) logo_path = null

            // if the logo is not preserved or deleted, then it is a new logo,
            if (!isPreserveImageBlob && !isDeleteImageBlob)
                logo_path = await handleFileSaving(formFiles[index], userMediaRoot.logos, isTesting)

            return { ...field, logo_path }
        })
    ) as T[];
}

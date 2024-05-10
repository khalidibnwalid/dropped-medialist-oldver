import type { itemBadgesType, itemData, itemlink } from "@/types/item";
import { dateStamped } from "@/utils/helperFunctions/dateStamped";
import getFileExtension from "@/utils/helperFunctions/getFileExtinsion";
import deleteAPI from "../deleteAPI";
import fetchAPI from "../fetchAPI";
import handleImageUpload from "./handleImageUpload";

export const handleEditingLogosFields = async (
    newData: (itemBadgesType | itemlink)[],
    originalData: (itemBadgesType | itemlink)[] = [], //for comparing
    orderCounter: number = 0,
    listID: string,
    itemFieldsTemplates?: (itemBadgesType | itemlink)[], //only provide it if it was called from inside an ite
    devmode?: boolean
) => {
    //if unuseed logos exist delete them
    //star shouldn't be deleted

    const unusedLogos = originalData?.filter(
        templ => !newData?.some((e) => e.logo_path === templ.logo_path)
    )

    async function deleteLogo(path: string) {
        //if want to allow plugins should change this to check other things than badges or links
        // it should check if it is used by any items , if so it shouldn't delete it
        const items: itemData[] = await fetchAPI(`items/${listID}`)
        if (!items.some(item =>
            item.links?.some(e => e?.logo_path && e.logo_path == path)
            || item.badges?.some(e => e?.logo_path && e.logo_path == path)
        )) {
            if (itemFieldsTemplates) { //=> called inside an item 
                // if inside an item it should see if it is using a template's logo, if so don't delete it
                if (!itemFieldsTemplates.some(e => e.logo_path && e.logo_path == path)) await deleteAPI('files', { fileNames: [`images/logos/${path}`] })
            } else {
                await deleteAPI('files', { fileNames: [`images/logos/${path}`] })
            }
        }
        //if list  = fieldsTemplate => called from an item
    }

    if (unusedLogos) {
        if (!devmode) {
            unusedLogos?.forEach(e => e.logo_path === 'star' ? null : deleteLogo(e.logo_path as string))
        } else {
            unusedLogos?.forEach(e => e.logo_path === 'star' ? null : console.log(e.logo_path)) //devmode
        }
    }

    return newData?.map(e => {
        // upload a new logo
        if (typeof (e.logo_path) === 'object') {
            orderCounter++
            const logoName = dateStamped(`${orderCounter.toString()}.${getFileExtension(e.logo_path[0].file.name)}`)
            handleImageUpload(e.logo_path, "logos", logoName, devmode);
            e.logo_path = logoName
            return e
        }

        if (e.logo_path === undefined //if logoless
            || originalData?.some((original) => (original.logo_path == e.logo_path //if already exists in the original data
                || itemFieldsTemplates?.some((temp) => temp.logo_path == e.logo_path)) //if it is a template's logo
                )) {
                    //just push it without uploading it
            return e
        }

    })
}
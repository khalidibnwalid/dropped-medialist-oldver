"use server"

import type { listData } from "@/types/list";
import type { itemData } from "@/types/item";
import "dotenv/config";
import deleteAPI from "../deleteAPI";
import fetchAPI from "../fetchAPI";
import handleDeletedItemMedia from "./handleDeletedItemMedia";

//SHOULD be called BEFORE a list is deleted

export default async function handleDeletedListMedia(listID: string) {
    let fileNames: string[] = []
    const listData: listData = await fetchAPI(`lists/${listID}`)
    const items: itemData[] = await fetchAPI(`items/${listID}`)

    const templates = listData.templates?.fieldTemplates

    function deleteImage(filename: string) {
        fileNames.push(`images/lists/${filename}`)
    }

    function deleteLogo(filename: string) {
        fileNames.push(`images/logos/${filename}`)
    }

    //should delete the list cover
    listData.cover_path && deleteImage(listData.cover_path)

    //should delete its links templates logos

    await templates?.links?.forEach((link) => {
        link.logo_path && deleteLogo(link.logo_path)
    })

    //should delete its badgets templates logos

    await templates?.badges?.forEach((badge) => {
        badge.logo_path && deleteLogo(badge.logo_path)
    })

    if (items?.length > 0) for (const item of items) {
        await handleDeletedItemMedia(item.id);
    }

    await deleteAPI('files', { fileNames })
}
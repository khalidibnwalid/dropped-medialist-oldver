"use server"

import type { listData } from "@/types/list";
import type { itemData, itemImageType } from "@/types/item";
import "dotenv/config";
import fetchAPI from "../fetchAPI";
import deleteAPI from "../deleteAPI";
import { handleEditingLogosFields } from "./handleEditingLogosFields";

//SHOULD be called BEFORE an item is deleted
export default async function handleDeletedItemMedia(itemID: string) {

    let fileNames: string[] = []

    const item: itemData = await fetchAPI(`items/id/${itemID}`);
    const itemImages: itemImageType[] = await fetchAPI(`images/${itemID}`);
    const listData: listData = await fetchAPI(`lists/${item.list_id}`)

    const templates = listData.templates?.fieldTemplates

    function deleteImage(filename: string) {
        fileNames.push(`images/items/${filename}`)
    }

    //delete poster and cover
    item.cover_path && deleteImage(item.cover_path as string)
    item.poster_path && deleteImage(item.poster_path  as string)

    //delete logos of links and badges
    item.links && await handleEditingLogosFields([], item.links, 0, item.list_id, templates?.links)
    item.badges && await handleEditingLogosFields([], item.badges, 0, item.list_id, templates?.badges)

    //delete images from gallery
    itemImages.length > 0 && itemImages.map((image) => {
        deleteImage(image.image_path)
    })

    deleteAPI('files', { fileNames })


}
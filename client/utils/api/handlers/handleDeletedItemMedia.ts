"use server"

import type { CollectionData } from "@/types/collection";
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
    const collectionData: CollectionData = await fetchAPI(`collections/${item.collection_id}`)

    const templates = collectionData.templates?.fieldTemplates

    function deleteImage(filename: string) {
        fileNames.push(`images/items/${filename}`)
    }

    //delete poster and cover
    item.cover_path && deleteImage(item.cover_path)
    item.poster_path && deleteImage(item.poster_path)

    //delete logos of links and badges
    item.links && await handleEditingLogosFields([], item.links, 0, item.collection_id, templates?.links)
    item.badges && await handleEditingLogosFields([], item.badges, 0, item.collection_id, templates?.badges)

    //delete images from gallery
    itemImages.length > 0 && itemImages.map((image) => {
        deleteImage(image.image_path)
    })

    deleteAPI('files', { fileNames })


}
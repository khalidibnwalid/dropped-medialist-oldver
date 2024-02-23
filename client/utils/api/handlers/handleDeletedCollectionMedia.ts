
"use server"

import type { CollectionData } from "@/types/collection";
import type { itemData } from "@/types/item";
import "dotenv/config";
import deleteAPI from "../deleteAPI";
import fetchAPI from "../fetchAPI";
import handleDeletedItemMedia from "./handleDeletedItemMedia";

//SHOULD be called BEFORE a collection is deleted

export default async function handleDeletedCollectionMedia(collectionID: string) {
    let fileNames: string[] = []
    const collectionData: CollectionData = await fetchAPI(`collections/${collectionID}`)
    const items: itemData[] = await fetchAPI(`items/${collectionID}`)

    const templates = collectionData.templates?.fieldTemplates

    function deleteImage(filename: string) {
        fileNames.push(`images/collections/${filename}`)
    }

    function deleteLogo(filename: string) {
        fileNames.push(`images/logos/${filename}`)
    }

    //should delete the collection cover
    collectionData.cover_path && deleteImage(collectionData.cover_path)

    //should delete its links templates logos

    templates?.links?.forEach((link) => {
        link.logo_path && deleteLogo(link.logo_path)
    })

    //should delete its badgets templates logos

    templates?.badges?.forEach((badge) => {
        badge.logo_path && deleteLogo(badge.logo_path)
    })

    items?.forEach((item) => {
        handleDeletedItemMedia(item.id)
    })
    deleteAPI('files',{ fileNames })
}
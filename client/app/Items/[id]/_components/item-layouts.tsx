'use client'

import { itemData, itemImageType, itemTag } from "@/types/item";
import { createContext } from "react";
import ItemLayout1 from "./layouts/layout1";
import { IMG_PATH } from "@/app/page";
import ItemLayout2 from "./layouts/layout2";

interface context {
    tagsData: itemTag[]
    itemData: itemData
    imagesData: itemImageType[]
    relatedItems: itemData[]
    coverPath? : string; //COVER is the BACKGROUND IMAGE!!!!!!! NOT the POSTER 

}

interface params {
    tagsData: itemTag[]
    itemData: itemData
    imagesData: itemImageType[]
    relatedItems: itemData[]

}

export const itemViewContext = createContext({} as context);

export default function ItemLayouts({ tagsData, itemData, imagesData, relatedItems }: params) {
    const coverPath = itemData.cover_path ?
        `${IMG_PATH}/images/items/${itemData.cover_path}` :
        (itemData.poster_path ?
            `${IMG_PATH}/images/items/${itemData.poster_path}` :
            undefined
        )
    return (
        <itemViewContext.Provider value={{ tagsData, itemData, imagesData, relatedItems, coverPath }}>
            {itemData.configurations?.layout == "1" && <ItemLayout1 />}
            {itemData.configurations?.layout == "2" && <ItemLayout2 />}

        </itemViewContext.Provider>
    )
}
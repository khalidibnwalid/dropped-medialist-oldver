'use client'

import { CollectionData } from "@/types/collection";
import type { itemTag } from "@/types/item";
import React, { Dispatch, SetStateAction, createContext, useState } from "react";
import { GroupedTagType, tagsGroupsSorter } from "./_helper-functions/tagsGroupsSorter";

interface context {
    collectionData: CollectionData,
    allTags: itemTag[],
    sortedTags: GroupedTagType[],
    displayedSortedTags: GroupedTagType[]
    unsortedDisplayedTags: itemTag[]
    setDisplayedTags: Dispatch<SetStateAction<itemTag[]>>,
}

export const TagsPageContext = createContext({} as context);

export default function TagsPageProvider({
    children,
    allTags = [],
    collectionData = {} as CollectionData
}: {
    children: React.ReactNode,
    allTags: itemTag[],
    collectionData: CollectionData
}) {

    const [unsortedDisplayedTags, setDisplayedTags] = useState<itemTag[]>(allTags)
    const displayedSortedTags = tagsGroupsSorter(unsortedDisplayedTags)
    const sortedTags = tagsGroupsSorter(allTags)

    return (
        <TagsPageContext.Provider
            value={{
                allTags,
                collectionData,
                displayedSortedTags,
                sortedTags,
                unsortedDisplayedTags,
                setDisplayedTags,
            }}
        >
            {children}
        </TagsPageContext.Provider>
    )
}
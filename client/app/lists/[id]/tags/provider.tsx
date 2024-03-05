'use client'

import { listData } from "@/types/list";
import type { itemTag } from "@/types/item";
import React, { Dispatch, SetStateAction, createContext, useState } from "react";
import { GroupedTagType, tagsGroupsSorter } from "./_helper-functions/tagsGroupsSorter";

interface context {
    listData: listData,
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
    listData = {} as listData
}: {
    children: React.ReactNode,
    allTags: itemTag[],
    listData: listData
}) {

    const [unsortedDisplayedTags, setDisplayedTags] = useState<itemTag[]>(allTags)
    const displayedSortedTags = tagsGroupsSorter(unsortedDisplayedTags)
    const sortedTags = tagsGroupsSorter(allTags)

    return (
        <TagsPageContext.Provider
            value={{
                allTags,
                listData: listData,
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
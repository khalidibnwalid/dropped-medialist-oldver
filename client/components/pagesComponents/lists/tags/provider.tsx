import type { itemTag } from "@/types/item";
import { listData } from "@/types/list";
import React, { Dispatch, SetStateAction, createContext, use, useEffect, useState } from "react";
import { GroupedTagType, tagsGroupsSorter } from "../../../../utils/helperFunctions/tagsGroupsSorter";

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
    useEffect(() => setDisplayedTags(allTags), [allTags]) // update displayed tags when cache changes
    
    const [unsortedDisplayedTags, setDisplayedTags] = useState<itemTag[]>(allTags)
    const sortedTags = tagsGroupsSorter(allTags)
    const displayedSortedTags = tagsGroupsSorter(unsortedDisplayedTags)
    
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
'use client'

import { CollectionData } from "@/types/collection";
import type { itemData, itemTag } from "@/types/item";
import useLocalStorage from "@/utils/hooks/useLocalStorage";
import { Options, parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import React, { Dispatch, MouseEventHandler, SetStateAction, createContext, useEffect, useState } from "react";
interface context {
    viewMode: string;
    setViewMode: Dispatch<SetStateAction<string>>;
    allItems: itemData[]
    collectionData: CollectionData
    displayedItems: itemData[];
    setDisplayedItems: Dispatch<SetStateAction<itemData[]>>;
    toggledState: string,
    stateFilter: Function,
    favFilter: MouseEventHandler<HTMLButtonElement>,
    favState: boolean,
    advancedSearchVisability: boolean,
    setAdvancedSearchVisability: Dispatch<SetStateAction<boolean>>,
    isItemUnderFilter: Function,
    tags: itemTag[],
    usedTags: string[],
    setUsedTags: Dispatch<SetStateAction<string[]>>,
    setTagsQuery: <Shallow>(value: string[]
        | ((old: string[] | null) => string[] | null)
        | null, options?: Options<Shallow> |
            undefined) => Promise<URLSearchParams>,
    tagsSearchOR: boolean,
    setTagsSearchOR: Dispatch<SetStateAction<boolean>>,
}

//using useState inside the main page will cause unnecessary rerander of full page
//which will cause items to be needlessly refetched and the page to be reloaded,
//so i moved it to its own component

export const collectionBodyContext = createContext({} as context);

export default function CollectionBodyProvider({
    children,
    allItems = [],
    collectionData = {} as CollectionData,
    tags = []
}: {
    children: React.ReactNode,
    allItems: itemData[],
    collectionData: CollectionData,
    tags: itemTag[]
}) {
    const [viewMode, setViewMode] = useLocalStorage(`col-${collectionData.id}_viewMode`, 'cards')
    const [toggledState, setToggledState] = useLocalStorage(`col-${collectionData.id}_progressState`, '')

    const [favState, setFavState] = useState(false)
    const [displayedItems, setDisplayedItems] = useState<itemData[]>(allItems)

    const [advancedSearchVisability, setAdvancedSearchVisability] = useState(false)

    const [tagsQuery, setTagsQuery] = useQueryState('tags', parseAsArrayOf(parseAsString))
    const [tagsSearchOR, setTagsSearchOR] = useState(false)
    const [usedTags, setUsedTags] = useState<string[]>([]) // tagID[]


    function name_to_id(name: string) {
        const found = tags?.find(tag => tag.name === name)
        return found?.id
    }
    function filteredItemsbyCurrentTag() {
        //default for OR is False, thus AND is considred true, so a false OR is a true AND 
        //doesn't filter by state or fav

        const tagsID = tagsQuery?.map(tagName => name_to_id(tagName)).filter(id => id !== undefined) as string[] || [];
        setUsedTags(tagsID)
        const filteredItems = allItems.filter(item => tagsSearchOR ? item.tags.some(tag => tagsID.includes(tag)) :
            tagsID.every(id => item.tags.includes(id))
        )
        return filteredItems
    }

    function stateFilter(stateName: string, force?: boolean) {
        //force will force the state,
        // so if we are toggling the same state (like when loading it from localStorage) it will be re-toggled
        const items = (tagsQuery && tagsQuery.length > 0) ? filteredItemsbyCurrentTag() : allItems
        if (!force) setToggledState(toggledState !== stateName ? stateName : '')
        if (toggledState !== stateName || force) {
            const filtered = items.filter((item) =>
                stateName === item.progress_state?.name
                && (favState ? item.fav === favState : true) //if fav is toggled go for fav items
            )
            setDisplayedItems(filtered)
        } else if (favState) {
            const filtered = items.filter((item) => item.fav === true)
            setDisplayedItems(filtered)
        } else {
            setDisplayedItems(items)
        }
    }

    function favFilter() {
        setFavState(!favState)
        const items = (tagsQuery && tagsQuery.length > 0) ? filteredItemsbyCurrentTag() : allItems

        if (!favState) {
            //fav should show what is fav form the displayeditems even if they were StateFiltered
            const filtered = displayedItems.filter((item) => item.fav === true)
            setDisplayedItems(filtered)
        } else if (toggledState) {
            //if unToggled but a stateFilter is selected
            const filtered = items.filter((item) => toggledState === item.progress_state?.name)
            setDisplayedItems(filtered)
        } else {
            setDisplayedItems(items)
        }
    }

    function isItemUnderFilter(item: itemData) {
        //we use this function as an addition for each filter process to check if the item is under current State / Fav filter
        return (
            (favState ? item.fav === favState : true)
            //if fav is toggled go for fav items
            && (toggledState ? item.progress_state?.name === toggledState : true)
            //if as state is toggled go for items with this state
        )
    }

    useEffect(() => {
        if (toggledState) stateFilter(toggledState, true)
    }, [])

    useEffect(() => {
        if (tagsQuery) {
            const filteredItems = filteredItemsbyCurrentTag()
            setDisplayedItems(filteredItems)
        } else {
            const filteredItems = allItems.filter(item => isItemUnderFilter(item))
            setDisplayedItems(filteredItems)
        }
    }, [tagsQuery, tagsSearchOR])


    return (
        <collectionBodyContext.Provider
            value={{
                viewMode,
                setViewMode,
                displayedItems,
                setDisplayedItems,
                allItems,
                collectionData,
                stateFilter,
                toggledState,
                favFilter,
                favState,
                advancedSearchVisability,
                setAdvancedSearchVisability,
                isItemUnderFilter,
                tags,
                usedTags,
                setUsedTags,
                setTagsQuery,
                tagsSearchOR,
                setTagsSearchOR,
            }}
        >
            {children}
        </collectionBodyContext.Provider>
    )
}
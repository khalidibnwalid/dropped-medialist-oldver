'use client'

import { CollectionData } from "@/types/collection";
import type { itemData } from "@/types/item";
import useLocalStorage from "@/utils/hooks/useLocalStorage";
import React, { Dispatch, MouseEventHandler, SetStateAction, createContext, useEffect, useState } from "react";

interface context {
    viewMode: string;
    setViewMode: Dispatch<SetStateAction<string>>;
    displayedItems: itemData[];
    setDisplayedItems: Dispatch<SetStateAction<itemData[]>>;
    allItems: itemData[]
    collectionData: CollectionData
    stateFilter: Function,
    toggledState: string,
    favFilter: MouseEventHandler<HTMLButtonElement>,
    favState: boolean,
}

export const collectionBodyContext = createContext({} as context);

export default function CollectionBodyProvider({
    children,
    allItems = [],
    collectionData = {} as CollectionData
}: {
    children: React.ReactNode,
    allItems: itemData[],
    collectionData: CollectionData
}) {
    const [viewMode, setViewMode] = useLocalStorage(`col-${collectionData.id}_viewMode`, 'cards')
    const [toggledState, setToggledState] = useLocalStorage(`col-${collectionData.id}_progressState`, '')

    const [favState, setFavState] = useState(false)
    const [displayedItems, setDisplayedItems] = useState<itemData[]>(allItems)


    useEffect(() => {
        if (toggledState) stateFilter(toggledState, allItems, true)
    }, [])


    function stateFilter(stateName: string, itemsToSet: itemData[] = allItems, force?: boolean) {
        //force will force the state,
        // so if we are toggling the same state (like when loading it from localStorage) it will be re-toggled
        if (!force) setToggledState(toggledState !== stateName ? stateName : '')
        if (toggledState !== stateName || force) {
            const filtered = allItems.filter((item) =>
                stateName === item.progress_state?.name
                && (favState ? item.fav === favState : true) //if fav is toggled go for fav items
            )
            setDisplayedItems(filtered)
        } else if (favState) {
            const filtered = allItems.filter((item) => item.fav === true)
            setDisplayedItems(filtered)
        } else {
            setDisplayedItems(itemsToSet)
        }
    }

    function favFilter() {
        setFavState(!favState)

        if (!favState) {
            //fav should show what is fav form the displayeditems even if they were StateFiltered
            const filtered = displayedItems.filter((item) => item.fav === true)
            setDisplayedItems(filtered)
        } else if (toggledState) {
            //if unToggled but a stateFilter is selected
            const filtered = allItems.filter((item) => toggledState === item.progress_state?.name)
            setDisplayedItems(filtered)
        } else {
            setDisplayedItems(allItems)
        }
    }


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
            }}
        >
            {children}
        </collectionBodyContext.Provider>
    )
}
import { listData } from "@/types/list";
import type { itemData, itemTag } from "@/types/item";
import useLocalStorage from "@/utils/hooks/useLocalStorage";
import { Options, parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import React, { Dispatch, KeyboardEvent, KeyboardEventHandler, MouseEventHandler, RefObject, SetStateAction, createContext, useEffect, useRef, useState } from "react";

interface context {
    viewMode: string;
    setViewMode: Dispatch<SetStateAction<string>>;
    allItems: itemData[]
    listData: listData
    displayedItems: itemData[];
    setDisplayedItems: Dispatch<SetStateAction<itemData[]>>;
    toggledState: string,
    stateFilter: Function,
    favFilter: MouseEventHandler<HTMLButtonElement>,
    favState: boolean,
    advancedSearchVisability: boolean,
    setAdvancedSearchVisability: Dispatch<SetStateAction<boolean>>,
    tags: itemTag[],
    usedTags: string[],
    setUsedTags: Dispatch<SetStateAction<string[]>>,
    setTagsQuery: <Shallow>(value: string[]
        | ((old: string[] | null) => string[] | null)
        | null, options?: Options<Shallow> |
            undefined) => Promise<URLSearchParams>,
    tagsSearchOR: boolean,
    setTagsSearchOR: Dispatch<SetStateAction<boolean>>,
    searchRef: RefObject<HTMLInputElement>,
    handleSearch: KeyboardEventHandler<HTMLInputElement> & Function
}

//using useState inside the main page will cause unnecessary rerander of full page
//which will cause items to be needlessly refetched and the page to be reloaded,
//so i moved it to its own component

export const listBodyContext = createContext({} as context);

export default function ListBodyProvider({
    children,
    allItems = [],
    listData,
    tags = []
}: {
    children: React.ReactNode,
    allItems?: itemData[],
    listData: listData,
    tags?: itemTag[]
}) {
    const [displayedItems, setDisplayedItems] = useState<itemData[]>(allItems)

    const [viewMode, setViewMode] = useLocalStorage(`col-${listData.id}_viewMode`, 'cards')
    const [toggledState, setToggledState] = useLocalStorage(`col-${listData.id}_progressState`, '')
    const [favState, setFavState] = useState(false)

    const [tagsQuery, setTagsQuery] = useQueryState('tags', parseAsArrayOf(parseAsString))
    const [tagsSearchOR, setTagsSearchOR] = useState(false)
    const [usedTags, setUsedTags] = useState<string[]>([]) // tagID[]
    const usedTagsID = tagsQuery?.map(tagName => name_to_id(tagName)).filter(id => id !== undefined) as string[] || []; //tagID[]

    const [advancedSearchVisability, setAdvancedSearchVisability] = useState(false)
    const searchRef = useRef<HTMLInputElement>(null)
    const searchInput = searchRef.current?.value.trim().toLowerCase() || null


    // in all isItemUnder[x] filters it should return true if the wanted filter is disabled,
    // otherwise the resulted item from filter will be empty
    function isItemUnderSearch(item: itemData) {
        //we use this function as an addition for each filter process to check if the item is under the search,
        // unlike handle search which will just filter them blindly, this just will check if 'item' is passed or not
        // it will ignore filters such as current state or fav
        if (!searchInput) return true //we want the loop to continue
        return (item.title.toLowerCase().split(" ").some(word => word.startsWith(searchInput)))
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
    function isItemUnderTagsFilter(item: itemData) {
        //we use this function as an addition for each filter process to check if the item is under current Tags filter
        //it will ignote fav/state/search fiters

        //default for OR is False, thus AND is considred true, so a false OR is a true AND 
        if (!tagsQuery) true
        if (tagsSearchOR
            ? item.tags.some(tag => usedTagsID.includes(tag))
            : usedTagsID.every(id => item.tags.includes(id))
        ) return true
    }

    function name_to_id(name: string) {
        const found = tags?.find(tag => tag.name === name)
        return found?.id
    }

    function handleSearch(event: KeyboardEvent<HTMLInputElement>) {
        const input = searchRef.current?.value.trim().toLowerCase() || null
        if (!input) {
            const filtered = allItems.filter(item =>
                isItemUnderFilter(item)
                && isItemUnderTagsFilter(item)
            )
            setDisplayedItems(filtered)
        } else {
            const filtered = allItems.filter(item =>
                item.title.toLowerCase().split(" ").some(word => word.startsWith(input))
                && isItemUnderFilter(item)
                && isItemUnderTagsFilter(item)
            )
            setDisplayedItems(filtered)
        }
    }

    function stateFilter(stateName: string, force?: boolean) {
        //force will force the state,
        // so if we are toggling the same state (like when loading it from localStorage) it will be re-toggled
        if (!force) setToggledState(toggledState !== stateName ? stateName : '')
        if (toggledState !== stateName || force) {
            const filtered = allItems.filter((item) =>
                stateName === item.progress_state?.name
                && (favState ? item.fav === favState : true) //if fav is toggled go for fav items
                && isItemUnderSearch(item)
                && isItemUnderTagsFilter(item)
            )
            console.log(searchInput)
            setDisplayedItems(filtered)
        } else if (favState || searchInput || tagsQuery) {
            const filtered = allItems.filter((item) =>
                (favState ? item.fav === favState : true)
                && isItemUnderSearch(item)
                && isItemUnderTagsFilter(item)
            )
            console.log(searchInput)
            setDisplayedItems(filtered)
        } else {
            setDisplayedItems(allItems)
        }
    }

    function favFilter() {
        setFavState(!favState)
        if (!favState) {
            //fav should show what is fav form the displayeditems even if they were StateFiltered
            const filtered = displayedItems.filter((item) =>
                item.fav === true
                && isItemUnderSearch(item)
                && isItemUnderTagsFilter(item)
            )
            setDisplayedItems(filtered)
        } else if (toggledState || searchInput || tagsQuery) {
            //if unToggled but a stateFilter is selected
            const filtered = allItems.filter((item) =>
                (toggledState ? toggledState === item.progress_state?.name : true)
                && isItemUnderSearch(item)
                && isItemUnderTagsFilter(item)
            )
            setDisplayedItems(filtered)
        } else {
            setDisplayedItems(allItems)
        }
    }


    useEffect(() => {
        if (toggledState) stateFilter(toggledState, true)
    }, [])

    useEffect(() => {
        if (tagsQuery) {
            const filteredItems = allItems.filter(item =>
                isItemUnderFilter(item)
                && isItemUnderSearch(item)
                && isItemUnderTagsFilter(item)
            )
            setDisplayedItems(filteredItems)
            setUsedTags(usedTagsID)
        } else {
            const filteredItems = allItems.filter(item => isItemUnderFilter(item))
            setDisplayedItems(filteredItems)
        }
    }, [tagsQuery, tagsSearchOR])


    return (
        <listBodyContext.Provider
            value={{
                viewMode,
                setViewMode,
                displayedItems,
                setDisplayedItems,
                allItems,
                listData,
                stateFilter,
                toggledState,
                favFilter,
                favState,
                advancedSearchVisability,
                setAdvancedSearchVisability,
                tags,
                usedTags,
                setUsedTags,
                setTagsQuery,
                tagsSearchOR,
                setTagsSearchOR,
                searchRef,
                handleSearch,
            }}
        >
            {children}
        </listBodyContext.Provider>
    )
}
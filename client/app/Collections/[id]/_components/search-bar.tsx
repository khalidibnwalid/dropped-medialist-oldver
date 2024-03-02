'use client'

import { Button, Input } from "@nextui-org/react"
import { KeyboardEvent, useContext, useEffect, useRef } from "react"
import { collectionBodyContext } from "../provider"
import { BsThreeDotsVertical } from "react-icons/bs"
import { BiDownArrow, BiSearch, BiUpArrow } from "react-icons/bi"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";


function CollectionSearchBar() {
    const { allItems, setDisplayedItems, setAdvancedSearchVisability, advancedSearchVisability, isItemUnderFilter } = useContext(collectionBodyContext)

    const searchRef = useRef<HTMLInputElement>(null)

    function handleSearch(event: KeyboardEvent<HTMLInputElement>) {
        const input = searchRef.current?.value.trim().toLowerCase() || null
        if (!input) {
            const filtered = allItems.filter(item => isItemUnderFilter(item))
            setDisplayedItems(filtered)
        } else {
            const filtered = allItems.filter(item =>
                item.title.toLowerCase().split(" ").some(word => word.startsWith(input))
                && isItemUnderFilter(item)
            )
            setDisplayedItems(filtered)
        }
    }

    return (
        <Input
            ref={searchRef}
            onKeyUp={handleSearch}
            classNames={{
                label: "text-black/50 dark:text-white/90",
                input: [
                    "bg-transparent",
                    "text-black/90 dark:text-white/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60 ",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                    "shadow-xl",
                    "rounded-2xl",
                    "bg-default-200/50",
                    "dark:bg-default/60",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focused=true]:bg-default-200/50",
                    "dark:group-data-[focused=true]:bg-default/60",
                    "!cursor-text",
                    "pr-1",
                ],
            }}
            placeholder="Search Items..."
            size="sm"
            startContent={
                <BiSearch size={30} />
            }
            endContent={
                <Button
                    size="sm"
                    className="rounded-xl bg-transparent hover:bg-default-100"
                    onPress={() => setAdvancedSearchVisability(!advancedSearchVisability)}
                    isIconOnly
                >
                    {advancedSearchVisability ? <IoIosArrowUp /> : <BsThreeDotsVertical />}
                </Button>
            }
        />
    )
}

export default CollectionSearchBar
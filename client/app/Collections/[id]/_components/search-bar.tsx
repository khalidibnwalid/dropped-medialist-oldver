'use client'

import { Button, Input } from "@nextui-org/react"
import { KeyboardEvent, useContext, useEffect, useRef } from "react"
import { collectionBodyContext } from "../provider"
import { BsThreeDotsVertical } from "react-icons/bs"
import { BiSearch } from "react-icons/bi"

function CollectionSearchBar() {
    const { allItems, toggledState, favState, setDisplayedItems } = useContext(collectionBodyContext)

    const searchRef = useRef<HTMLInputElement>(null)

    function handleSearch(event: KeyboardEvent<HTMLInputElement>) {
        const input = searchRef.current?.value.trim().toLowerCase() || null
        if (!input) {
            const filtered = allItems.filter(item =>
                (favState ? item.fav === favState : true) //if fav is toggled go for fav items
                && (toggledState ? item.progress_state?.name === toggledState : true)
                //if as state is toggled go for items with this state
            )
            setDisplayedItems(filtered)
        } else {
            const filtered = allItems.filter(item =>
                item.title.toLowerCase().split(" ").some(word => word.startsWith(input))
                && (favState ? item.fav === favState : true)
                && (toggledState ? item.progress_state?.name === toggledState : true)
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
                    className="rounded-xl bg-transparent hover:bg-default-100"
                    isIconOnly
                >
                    <BsThreeDotsVertical />
                </Button>
            }
        />
    )
}

export default CollectionSearchBar
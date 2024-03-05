'use client'

import { Input } from "@nextui-org/react"
import { KeyboardEvent, useContext, useRef } from "react"
import { BiSearch } from "react-icons/bi"
import { TagsPageContext } from "../provider"

function TagsSearchBar() {

    const { setDisplayedTags, allTags } = useContext(TagsPageContext)
    const searchRef = useRef<HTMLInputElement>(null)

    function handleSearch(event: KeyboardEvent<HTMLInputElement>) {
        const input = searchRef.current?.value.trim().toLowerCase() || null
        if (!input) {
            setDisplayedTags(allTags)
        } else {
            const filtered = allTags.filter(tag => tag.name.toLowerCase().split(" ").some(word => word.startsWith(input)))
            setDisplayedTags(filtered)
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
            placeholder="Search Tags..."
            size="sm"
            startContent={
                <BiSearch size={30} />
            }
        />
    )
}

export default TagsSearchBar
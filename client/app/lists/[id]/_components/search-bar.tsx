'use client'

import { Button, Input } from "@nextui-org/react"
import { useContext } from "react"
import { BiSearch } from "react-icons/bi"
import { BsThreeDotsVertical } from "react-icons/bs"
import { IoIosArrowUp } from "react-icons/io"
import { listBodyContext } from "../provider"


function ListSearchBar() {
    const { setAdvancedSearchVisability, advancedSearchVisability, searchRef, handleSearch } = useContext(listBodyContext)


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

export default ListSearchBar
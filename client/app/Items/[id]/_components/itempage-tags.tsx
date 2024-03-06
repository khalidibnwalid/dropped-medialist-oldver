'use client'

import { tagsGroupsSorter } from "@/app/lists/[id]/tags/_helper-functions/tagsGroupsSorter"
import { itemTag } from "@/types/item"
import { Chip } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { createSerializer, parseAsArrayOf, parseAsString } from "nuqs"
import { useContext } from "react"
import { itemViewContext } from "./item-layouts"

function ItemTags() {
    const { tagsData } = useContext(itemViewContext)

    const ArrayTags = tagsGroupsSorter(tagsData)

    return tagsData.length > 0 &&
        <div>
            <p className=" text-base text-center font-extrabold pb-2" key="Tag Fields">Tags</p>

            {ArrayTags.map((group) => {

                if (group.groupName !== "" && group.groupTags.length > 0) {
                    return (
                        <div key={group.groupName}>
                            <p className="p-1 font-semibold text-sm">{group.groupName} :</p>

                            {group.groupTags.map((tag) => (
                                <TagChip tag={tag} key={tag.name} />

                            ))}
                        </div>
                    );
                } else if (group.groupTags.length > 0) {
                    return (
                        <div key="groupless-tags">
                            {group.groupTags.map((tag) => (
                                <TagChip tag={tag} key={tag.name} />
                            ))}
                        </div>
                    )
                } else {
                    return null;
                }
            }
            )}
        </div>
}

export default ItemTags

const TagChip = ({ tag }: { tag: itemTag }) => {
    const router = useRouter()
    function pushLink() {
        const serialize = createSerializer({
            tags: parseAsArrayOf(parseAsString)
        })
        const query = serialize({ tags: [tag.name] })
        router.push(`/lists/${tag.list_id + query}`)
    }

    return (<Chip
        size="sm" variant="flat"
        className="m-1 duration-250 hover:bg-pure-opposite hover:text-pure-theme hover:scale-105 hover:cursor-pointer"
        onClick={pushLink}
    >
        {tag.name}
    </Chip>)
}
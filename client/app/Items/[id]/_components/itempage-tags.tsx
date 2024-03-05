'use client'

import { tagsGroupsSorter } from "@/app/lists/[id]/tags/_helper-functions/tagsGroupsSorter"
import { Chip } from "@nextui-org/react"
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
                                <Chip
                                    size="sm" variant="flat"
                                    className="m-1 duration-250 hover:bg-pure-opposite hover:text-pure-theme hover:scale-105"
                                    key={tag.name}
                                >
                                    {tag.name}
                                </Chip>
                            ))}
                        </div>
                    );
                } else if (group.groupTags.length > 0) {
                    return (
                        <div key="groupless-tags">
                            {group.groupTags.map((tag) => (
                                <Chip
                                    size="sm" variant="flat"
                                    className="m-1 duration-250 hover:bg-pure-opposite hover:text-pure-theme hover:scale-105"
                                    key={tag.name}
                                >
                                    {tag.name}
                                </Chip>
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

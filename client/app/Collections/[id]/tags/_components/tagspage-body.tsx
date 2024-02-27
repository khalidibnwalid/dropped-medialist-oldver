'use client'

import type { itemTag } from "@/types/item";
import { Card } from "@nextui-org/react";
import { GroupedTagType, tagsGroupsSorter } from "../_helper-functions/tagsGroupsSorter";
import { AddTag } from "./addtag";
import { TagCard } from "./tagcard";

type params = {
    tags: itemTag[]
    id: string
}

let sortedTags: GroupedTagType[] = []

function TagsPageBody({ tags, id }: params) {
    sortedTags = tagsGroupsSorter(tags)

    return (
        <>
            <AddTag collectionID={id} sortedTags={sortedTags} />

            {sortedTags?.map((group) => {
                if (group.groupName !== "" && group.groupTags.length > 0) {
                    return (
                        <>
                            <TagGroup key={group.groupName} title={group.groupName} />

                            {group.groupTags.map((tag) => (
                                <TagCard key={`${group.groupName}-${tag.id}`} tag={tag} sortedTags={sortedTags} />
                            ))}
                        </>
                    )
                } else if (group.groupTags.length > 0) {
                    return (
                        <>
                            <TagGroup title="Groupless Tags" />

                            {group.groupTags.map((tag) => (
                                <TagCard key={`groupless-${tag.id}`} tag={tag} sortedTags={sortedTags} />
                            ))}
                        </>
                    )
                }

            }
            )}

        </>
    )
}

export default TagsPageBody;

const TagGroup = ({ title }: { title: string | null }) => (
    <Card
        className="w-full p-3 pl-5
                    shadow-lg 
                    rounded-2xl bg-default
                    duration-150 
                    hover:bg-default-300 animate-fade-in"
    >
        <p className="text-xl font-semibold">{title}</p>
    </Card>
)



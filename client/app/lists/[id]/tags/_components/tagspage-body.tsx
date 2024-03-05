'use client'

import { Card } from "@nextui-org/react";
import { useContext } from "react";
import { TagsPageContext } from "../provider";
import { TagCard } from "./tagcard";


function TagsPageBody() {
    const { displayedSortedTags } = useContext(TagsPageContext)

    return (
        <>
            {displayedSortedTags?.map((group, index) => {
                if (group.groupName !== "" && group.groupTags.length > 0) {
                    return (
                        <div key={index + '-' + group.groupName + "_"} className="grid grid-flow-row gap-y-3">
                            <TagGroup key={index + '-' + group.groupName} title={group.groupName} />

                            {group.groupTags.map((tag) => (
                                <TagCard key={group.groupName + '-' + tag.id} tag={tag} sortedTags={displayedSortedTags} />
                            ))}
                        </div>
                    )
                } else if (group.groupTags.length > 0) {
                    return (
                        <div key={index + '-' + 'groupless_'} className="grid grid-flow-row gap-y-3" >
                            <TagGroup title="Groupless Tags" key={index + '-' + 'groupless'} />

                            {group.groupTags.map((tag) => (
                                <TagCard key={'groupless-' + tag.id} tag={tag} sortedTags={displayedSortedTags} />
                            ))}
                        </div>
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



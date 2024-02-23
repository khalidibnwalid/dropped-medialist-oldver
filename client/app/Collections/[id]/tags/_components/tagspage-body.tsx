'use client'

import type { itemTag } from "@/types/item";
import deleteAPI from "@/utils/api/deleteAPI";
import patchAPI from "@/utils/api/patchAPI";
import { Autocomplete, AutocompleteItem, Button, Card, Input, Popover, PopoverContent, PopoverTrigger, Textarea } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiPlus, BiSolidPencil, BiTrashAlt, BiX } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { GroupedTagType, tagsGroupsSorter } from "../_helper-functions/tagsGroupsSorter";
import postAPI from "@/utils/api/postAPI";
import sanitizeObject from "@/utils/helper-functions/sanitizeObject";
import { TagCard } from "./tagcard";
import { AddTag } from "./addtag";

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
                    shadow-perfect-md 
                    rounded-2xl bg-[#383838] 
                    duration-150 
                    hover:bg-[#484848] animate-fade-in"
    >
        <p className="text-xl font-semibold">{title}</p>
    </Card>
)



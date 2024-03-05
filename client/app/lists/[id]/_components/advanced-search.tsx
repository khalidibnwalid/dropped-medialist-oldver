'use client'

import { itemTag } from "@/types/item";
import { Button, Card, Checkbox, CheckboxGroup, Divider, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
import { listBodyContext } from "../provider";
import { tagsGroupsSorter } from "../tags/_helper-functions/tagsGroupsSorter";

function ListAdvancedSearch() {
    const { tags, advancedSearchVisability, setAdvancedSearchVisability, usedTags, setUsedTags, setTagsQuery, tagsSearchOR, setTagsSearchOR } = useContext(listBodyContext)

    const tagsSearchRef = useRef<HTMLInputElement>(null)
    const router = useRouter();
    const [displayedTags, setDisplayedTags] = useState<itemTag[]>(tags)

    const groupedDisplayedTags = tagsGroupsSorter(displayedTags)

    function handleTagsSearch() {
        const input = tagsSearchRef.current?.value.trim().toLowerCase() || null
        if (!input) {
            setDisplayedTags(tags) //return all results
            return
        }
        const filtered = tags.filter(tag =>
            tag.name.toLowerCase().split(" ").some(word => word.startsWith(input)) // so you can search by typing the n-th word
        )
        setDisplayedTags(filtered)
    }
    function id_to_name(id: string) {
        const found = tags?.find(tag => tag.id === id)
        return found?.name
    }

    function handleUsedTags(newArray: string[]) {
        setUsedTags(newArray)
        const tagsNames = newArray.map(tagID => id_to_name(tagID)) as string[]
        if (newArray.length === 0) {
            setTagsQuery(null)
        } else {
            setTagsQuery(tagsNames)
        }
    }



    return advancedSearchVisability && (
        <Card className="grid gap-y-3 w-full py-3 mt-2 px-6 shadow-md bg-accented/40 animate-fade-in">
            <p>Advanced Search</p>

            <div className="flex items-center gap-x-4 px-3">
                <Button
                    size="sm"
                    variant="solid"
                    type="button"
                    color={tagsSearchOR ? undefined : "primary"}
                    className={tagsSearchOR ? "bg-accented" : undefined}
                    onClick={() => setTagsSearchOR(!tagsSearchOR)}
                >
                    {tagsSearchOR ? "OR" : "AND"}
                </Button>
                <p className="text-zinc-500"> {`Filter by Tags (${tagsSearchOR ? "OR" : "AND"})`}</p>

            </div>

            <div>
                <CheckboxGroup
                    value={usedTags}
                    onValueChange={e => handleUsedTags(e)}
                    className="grid grid-cols-1 w-full gap-y-1 p-2 bg-pure-theme/5 overflow-y-auto overflow-x-hidden max-h-48 pr-2 "
                >
                    {groupedDisplayedTags?.map((tagGroup, index) => (
                        <>
                            {tagGroup.groupName &&
                                <p
                                    className="flex w-full sticky top-1 z-20 py-1.5 px-2 
                                bg-default-100 shadow-sm rounded-sm animate-fade-in"
                                    key={index + '-' + tagGroup}
                                >
                                    {tagGroup.groupName}
                                </p>
                            }
                            {tagGroup.groupTags.map(tag =>
                                <Checkbox
                                    className="animate-fade-in"
                                    key={index + '-' + tag.name}
                                    value={tag.id}
                                >
                                    {tag.name}
                                </Checkbox>
                            )}
                        </>
                    ))}
                </CheckboxGroup>

                <div className=" w-full sticky bottom-1 grid">
                    <Divider orientation="horizontal" className="my-2" />
                    <Input
                        ref={tagsSearchRef}
                        onKeyUp={handleTagsSearch}
                        size="sm"
                        variant="flat"
                        label="Search Tags..."
                    />

                </div>
            </div>

        </Card>
    )
}


export default ListAdvancedSearch;
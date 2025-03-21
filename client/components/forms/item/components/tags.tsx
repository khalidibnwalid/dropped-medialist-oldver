import { tagsGroupsSorter } from "@/utils/helperFunctions/tagsGroupsSorter"
import type { itemTag } from "@/types/item";
import sanitizeString from "@/utils/helperFunctions/sanitizeString";
import { Button, Checkbox, CheckboxGroup, Divider, Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { KeyboardEvent, useContext, useEffect, useRef, useState } from "react";
import { useFieldArray } from 'react-hook-form';
import { BiPurchaseTag, BiX } from "react-icons/bi";
import { ItemFormContext } from "../provider";

function ItemTagsForm({ tagsData = [] }: { tagsData: itemTag[] }) {
    const { control, itemData } = useContext(ItemFormContext)
    const searchRef = useRef<HTMLInputElement>(null)

    const [usedTags, setUsedTags] = useState<string[]>(itemData?.tags || []); //current added tags' array
    const [newTags, setNewTags] = useState<string[]>([])

    const [displayedTags, setDisplayedTags] = useState<itemTag[]>(tagsData) //displayed tags for search functionality
    const groupedDisplayedTags = tagsGroupsSorter(displayedTags) //grouping tags

    const { append, replace } = useFieldArray({ //field
        control,
        name: "tags"
    });

    function addTag() {
        const input = searchRef.current?.value.trim() || null
        // space can cause problems such as adding a " " tag (a blank tag) by wrong so trim input
        if (!input) return
        sanitizeString(input)

        const tagExists = tagsData.find(tag => tag.name.toLowerCase() == input.toLowerCase()) // if tag exists in the database 
        const tagIsUsed = usedTags.find(id => id == tagExists?.id) // tag is checked

        if (tagIsUsed) return //to ignore if you want to re-add the same tag

        if (tagExists) {
            // if the tag exists add it to the list
            append({ value: tagExists.id })
            const newArray = [...usedTags, tagExists.id]
            setUsedTags(newArray)
        } else {
            // new tag that doesn't exist is stored in a special way so it can be handled alone
            // they are stored as a normal name, and since it is not a uuid, it doesn't pass the UUID validator sin 
            append({ value: input })
            const newArray = [...newTags, input]
            setNewTags(newArray)
            searchRef.current?.blur
        }
    }

    function handleSearch() {
        const input = searchRef.current?.value.trim().toLowerCase() || null
        if (!input) return setDisplayedTags(tagsData) //return all results

        const filtered = tagsData.filter(tag =>
            tag.name.toLowerCase().split(" ").some(word => word.startsWith(input)) // so you can search by typing the n-th word
        )
        setDisplayedTags(filtered)
    }

    function onKeyEvent(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') return addTag()
        handleSearch()
    }

    useEffect(() => {
        const newArray = [...newTags, ...usedTags].map(id => ({ value: id }))
        replace(newArray)
    }, [newTags, usedTags]);

    function id_to_name(id: string) {
        const found = tagsData?.find(tag => tag.id === id)
        return found?.name
    }

    const tagButtonClassNames = "group pl-11 rounded-md duration-200 bg-accented hover:bg-default animate-fade-in"
    const tagXClassNames = "text-xl scale-x-0 group-hover:scale-x-100 group-hover:block duration-200 origin-left"

    return (
        <>
            <p className="text-zinc-500">Tags</p>

            <div className="grid grid-cols-1 gap-y-2">
                <Popover onClose={() => setDisplayedTags(tagsData)}>
                    <PopoverTrigger>
                        <Button className="flex-none">Choose Tags <BiPurchaseTag /></Button>
                    </PopoverTrigger>
                    <PopoverContent className="px-4 py-2 rounded-2xl grid">

                        {newTags.length > 0 &&
                            <CheckboxGroup
                                label="To Be Added Tags"
                                value={newTags}
                                onValueChange={e => setNewTags(e)}
                                className="grid grid-cols-1 gap-y-1 overflow-y-auto overflow-x-hidden max-h-40 pr-2 "
                            >
                                {newTags.map((tagName, index) =>

                                    <Checkbox
                                        className="animate-fade-in"
                                        key={index + '-' + tagName}
                                        value={tagName}
                                    >
                                        {tagName}
                                    </Checkbox>
                                )}
                            </CheckboxGroup>
                        }

                        <CheckboxGroup
                            label="Selected Tags"
                            value={usedTags}
                            onValueChange={e => setUsedTags(e)}
                            className="grid grid-cols-1 min-w-60 max-w-96 gap-y-1 overflow-y-auto overflow-x-hidden max-h-96 pr-2 "
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
                                ref={searchRef}
                                onKeyUp={onKeyEvent}
                                size="sm"
                                variant="flat"
                                label="Search or Add Tags"
                            />

                        </div>

                    </PopoverContent>
                </Popover>
                {(usedTags.length > 0 || newTags.length > 0) &&
                    <div className="grid grid-cols-1 gap-y-1 p-2 max-h-80 overflow-y-auto overflow-x-hidden bg-default-100 rounded-xl space-y-1 shadow-lg animate-fade-in">
                        {newTags?.map((tagName, index) =>
                            <Button
                                className={tagButtonClassNames}
                                key={index + "-" + tagName}
                                onClick={() => {
                                    const newArray = newTags.filter(name => name !== tagName)
                                    setNewTags(newArray)
                                }}
                            >
                                {tagName}
                                <BiX className={tagXClassNames} />
                            </Button>
                        )}
                        {usedTags?.map((tagID, index) =>
                            <Button
                                className={tagButtonClassNames}
                                key={index + "-" + tagID}
                                onClick={() => {
                                    const newArray = usedTags.filter(id => id !== tagID)
                                    setUsedTags(newArray)
                                }}
                            >
                                {id_to_name(tagID)}
                                <BiX className={tagXClassNames} />
                            </Button>
                        )}
                    </div>}

            </div>

        </>
    )
}


export default ItemTagsForm;


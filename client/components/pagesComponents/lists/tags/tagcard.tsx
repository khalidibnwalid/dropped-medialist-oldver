import { TrashPopover } from "@/components/buttons/trashpop-button";
import type { itemTag } from "@/types/item";
import deleteAPI from "@/utils/api/deleteAPI";
import patchAPI from "@/utils/api/patchAPI";
import sanitizeObject from "@/utils/helperFunctions/sanitizeObject";
import { mutateTagCache } from "@/utils/query/cacheMutation";
import { Autocomplete, AutocompleteItem, Button, Card, Input, Textarea } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createSerializer, parseAsArrayOf, parseAsString } from "nuqs";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiSolidPencil, BiTrashAlt } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { GroupedTagType } from "@/utils/helperFunctions/tagsGroupsSorter";

export const TagCard = ({ tag, sortedTags }: { tag: itemTag, sortedTags: GroupedTagType[] }) => {
    const router = useRouter();
    const [editState, setEditState] = useState(false)
    const { register, handleSubmit } = useForm<itemTag>()

    const editMutation = useMutation({
        mutationFn: (data: itemTag) => patchAPI(`tags/${tag.id}`, data),
        onSuccess: (data) => mutateTagCache(data, "edit")
    })

    const deleteMutation = useMutation({
        mutationFn: () => deleteAPI('tags', { body: [tag.id] }),
        onSuccess: () => mutateTagCache(tag, "delete")
    })

    const onSubmit: SubmitHandler<itemTag> = (data) => {
        sanitizeObject(data)
        editMutation.mutate(data)
        setEditState(false)

        tag.name = data.name
        tag.description = data.description
        tag.group_name = data?.group_name
    }


    return (
        <div className="flex justify-start">
            <Card
                className=" w-full
                        p-2 pl-6 ml-10 
                        flex flex-row items-center
                        shadow-lg 
                        rounded-2xl bg-accented 
                        duration-150 
                        hover:bg-default animate-fade-in"
            >

                {editState ?
                    //Edit Tag
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex-grow grid grid-cols-1 gap-y-2 pr-4 animate-fade-in duration-200"
                    >

                        <div className="flex items-center">
                            <p className="text-sm flex-none mr-2">Name</p>
                            <Input
                                variant="bordered"
                                className="flex-grow"
                                size="sm"
                                aria-label="Tag's Name"
                                label=""
                                labelPlacement="outside"
                                defaultValue={tag.name}
                                required
                                {...register("name", { required: true })}
                            />

                            <p className="text-sm flex-none mx-2">Group</p>

                            <Autocomplete
                                aria-label="select progress state"
                                defaultItems={sortedTags.filter((data) => data.groupName != '')}
                                label=""
                                labelPlacement="outside"
                                className="flex-grow"
                                size="sm"
                                variant="bordered"
                                allowsCustomValue
                                defaultSelectedKey={tag.group_name}
                                {...register("group_name")}
                            >
                                {(data) => (
                                    <AutocompleteItem
                                        key={`${data.groupName}`}
                                    >
                                        {data.groupName}
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>

                            <Button
                                type="button"
                                className="flex-none mx-1"
                                onClick={handleSubmit(onSubmit)}
                            >
                                Save
                            </Button>
                        </div>
                        <Textarea
                            variant="bordered"
                            size="sm"
                            label="Description"
                            labelPlacement="outside-left"
                            maxRows={1}
                            className="w-full"
                            defaultValue={tag.description}
                            {...register("description")}
                        />
                    </form>

                    :
                    // View Tag
                    <div className="flex-grow text-start animate-fade-in">
                        <p className="text-lg font-semibold">{tag.name}</p>
                        <p>{tag.description}</p>
                    </div>
                }

                <div className="flex-none flex gap-x-2">
                    <Button
                        onPress={() => {
                            const serialize = createSerializer({
                                tags: parseAsArrayOf(parseAsString)
                            })
                            const query = serialize({ tags: [tag.name] })
                            router.push(`/lists/${tag.list_id + query}`)
                        }} //go to search query of items with this tag
                        className="text-xl shadow-sm"
                        isIconOnly
                    >
                        <FaEye />
                    </Button>

                    <Button
                        color={editState ? 'primary' : 'default'}
                        onPress={() => setEditState(!editState)} //instead of going to another page, it should dropdown a card to change
                        className="text-xl shadow-sm"
                        isIconOnly
                    >
                        <BiSolidPencil />
                    </Button>

                    <TrashPopover
                        placement="bottom-end"
                        onPress={() => deleteMutation.mutate()}
                    >
                        {({ isTrashOpen }) =>
                            <Button
                                className="text-xl shadow-sm"
                                color={isTrashOpen ? 'danger' : 'default'}
                                isIconOnly
                            >
                                <BiTrashAlt />
                            </Button>}
                    </TrashPopover>

                </div>
            </Card >
        </div >
    )
}


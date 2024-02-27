import type { itemTag } from "@/types/item";
import postAPI from "@/utils/api/postAPI";
import sanitizeObject from "@/utils/helper-functions/sanitizeObject";
import { Autocomplete, AutocompleteItem, Button, Card, Input, Textarea } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiPlus } from "react-icons/bi";
import { GroupedTagType } from "../_helper-functions/tagsGroupsSorter";

export const AddTag = ({ collectionID, sortedTags }: { collectionID: string, sortedTags: GroupedTagType[]}) => {
    const router = useRouter();
    const [showAdd, setShowAdd] = useState(false)

    const { register, handleSubmit, setValue, reset } = useForm<itemTag>()

    const onSubmit: SubmitHandler<itemTag> = (data) => {
        sanitizeObject(data)
        postAPI(`tags/${collectionID}`, { body: [data] })
        setShowAdd(false)
        
        //reset fields
        setValue("name", "")
        setValue("description", undefined)
        setValue("group_name", undefined)
        
        router.refresh()
    }

    return (
        <Card
            className=" w-full
                        flex justify-center
                        shadow-sm 
                        rounded-2xl
                        duration-150 
                        animate-fade-in"
        >
            {showAdd ?
                <form
                    className="flex-grow grid grid-cols-1 gap-y-2 p-4 animate-fade-in duration-200 bg-accented"
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
                            required
                            {...register("name", { required: true })}
                        />

                        <p className="text-sm flex-none mx-2">Group</p>

                        <Autocomplete
                            aria-label="select progress state"
                            defaultItems={sortedTags.filter((data) => data.groupName != '')}
                            label=""
                            defaultSelectedKey=''
                            labelPlacement="outside"
                            className="flex-grow"
                            size="sm"
                            variant="bordered"
                            allowsCustomValue
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
                    </div>
                    <Textarea
                        variant="bordered"
                        size="sm"
                        label="Description"
                        labelPlacement="outside-left"
                        maxRows={1}
                        className="w-full"
                        {...register("description")}
                    />

                    <Button
                        type="button"
                        className="flex-none mx-1"
                        onClick={handleSubmit(onSubmit)}
                    >
                        <BiPlus className="text-3xl" /> Add Tag
                    </Button>
                </form>
                :
                <Button
                    onPress={() => setShowAdd(true)}
                    variant="bordered"
                    className="
                    flex items-center justify-center gap-x-3 text-lg
                     w-full p-6
                    shadow-lg 
                    rounded-2xl
                    duration-150 
                    animate-fade-in"
                >
                    <BiPlus className="text-3xl" /> New Tag
                </Button>
            }

        </Card>
    )
}

'use client'

import SortableFields from "@/components/forms/_components/sortableFields";
import { Button, Divider, Input, Textarea } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { ItemFormContext } from "../provider";

function ItemNotesForm() {
    const { control, itemData } = useContext(ItemFormContext)

    return (
        <>
            <p className="text-zinc-500">Notes (drag and drop)</p>
            <div className="grid grid-cols-1">
                <SortableFields
                    fieldsNumber={itemData?.content_fields?.length}
                    fieldControl={control}
                    fieldName='content_fields'
                    endContent={({ addField }) => (
                        <Button onClick={() => addField()} className=" my-2 w-full hover:scale-y-110" isIconOnly>
                            <BiPlus className=" p-1 text-3xl" /> New Note
                        </Button>
                    )}>

                    {({ data, index, removeField, fieldControl }) => (
                        <div key={'note-' + index}>
                            <div className="sortableFieldContainer">
                                <Button onClick={() => removeField(index)} variant="light" isIconOnly>
                                    <BiX className=" text-3xl" />
                                </Button>

                                <Controller
                                    control={fieldControl}
                                    name={`content_fields[${index}].name`}
                                    rules={{ required: true }}
                                    render={({ field }) =>
                                        <Input
                                            isRequired
                                            className=" flex-grow shadow-sm rounded-xl"
                                            variant="bordered"
                                            type="text"
                                            size="sm"
                                            label="Note's Title"
                                            {...field}
                                        />
                                    } />
                            </div>

                            <Controller
                                control={fieldControl}
                                name={`content_fields[${index}].body`}
                                render={({ field }) =>
                                    <Textarea
                                        className=" flex-grow shadow-sm rounded-xl"
                                        variant="bordered" type="text" size="sm"
                                        label="Note's Body"
                                        labelPlacement="outside"
                                        placeholder="Enter your Note"
                                        {...field} />
                                } />
                            <Divider className="my-3" />
                        </div>
                    )}

                </SortableFields>
            </div>
        </>
    )
}


export default ItemNotesForm;


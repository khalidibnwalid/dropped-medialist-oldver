'use client'
import SortableFields from "@/components/forms/sortableFields";
import { Button, Divider, Input, Textarea } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { EditItemPageContext } from "../page";

//should be turned into a component that take state and setstate as props 
interface fieldsParams {
    id: number;
}
function EditNoteFields() {
    const { control, itemData, setValue } = useContext(EditItemPageContext)

    setValue("content_fields", itemData.content_fields)
    let numberNum = 0
    itemData.content_fields?.forEach(() => numberNum++)

    
    return (
        <>
            <p className="text-zinc-500">Notes (drag and drop)</p>
            <div className="grid grid-cols-1">
                <SortableFields
                    fieldsNumber={numberNum}
                    fieldControl={control}
                    fieldName='content_fields'
                    endContent={({ addField }) => (
                        <Button onClick={() => addField()} className=" my-2 w-full hover:scale-y-110" isIconOnly>
                            <BiPlus className=" p-1 text-3xl" /> New Note
                        </Button>
                    )}>

                    {({ data, index, removeField, fieldControl }) => (
                        <div key={`note-${index}`}>
                            <div className="my-1 p-1 flex items-center gap-x-2 md:flex-wrap 
                                            rounded-md hover:bg-white/5 duration-200">
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


export default EditNoteFields;


'use client'

import SortableFields from "@/components/forms/_components/sortableFields";
import type { itemProgressState } from "@/types/item";
import { Autocomplete, AutocompleteItem, Button, Chip, Divider, Input } from "@nextui-org/react";
import type { Key } from "react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { CollectionFormContext } from "../provider";

function CollectionProgressStateForm() {
    const { control, setValue, getValues, fieldTemplates } = useContext(CollectionFormContext)

    const stateColors: itemProgressState[] = [
        { color: "primary", name: "Blue" },
        { color: "secondary", name: "Purple" },
        { color: "success", name: "Green" },
        { color: "warning", name: "Yellow" },
        { color: "danger", name: "Red" }
    ]

    return (
        <div id="progress states">
            <SortableFields
                fieldControl={control}
                fieldName="templates.fieldTemplates.states"
                fieldsNumber={fieldTemplates?.states?.length}
                startContent={({ addField }) => (
                    <div className="flex items-center justify-between">
                        <p className="text-zinc-500">States (drag and drop)</p>
                        <div className="flex gap-x-2">
                            <Button
                                onPress={() => addField()}
                                className="hover:scale-105" isIconOnly
                            >
                                <BiPlus className=" p-1 text-3xl" />
                            </Button>
                        </div>
                    </div>
                )}
            >
                {({ data, index, removeField, fieldControl }) => (

                    <div className="my-1 p-1 flex items-center gap-x-2 duration-200 md:flex-wrap rounded-md hover:bg-white/5" key={`progressStates-${index}`}>

                        <Button onClick={() => removeField(index)} variant="light" isIconOnly>
                            <BiX className=" text-3xl" />
                        </Button>

                        <Controller
                            control={fieldControl}
                            name={`templates.fieldTemplates.states[${index}].name`}
                            rules={{ required: true }}
                            render={({ field }) =>
                                <Input isRequired className=" flex-grow shadow-sm rounded-xl" variant="bordered" type="text" label="Name" size="sm" {...field} />
                            } />

                        <Divider orientation="vertical" className="h-5" />


                        <Autocomplete
                            defaultItems={stateColors}
                            label="Color"
                            className="flex-grow"
                            size="sm"
                            //const x = 
                            defaultSelectedKey={getValues<any>(`templates.fieldTemplates.states[${index}].color`)}
                            onSelectionChange={(key: Key) => { setValue<any>(`templates.fieldTemplates.states[${index}].color`, key); }}
                        >
                            {(key) => (
                                <AutocompleteItem
                                    key={key.color ? key.color : ''}
                                    endContent={
                                        <Chip
                                            radius="lg"
                                            color={key.color}
                                            className="w-5 h-5"
                                        >
                                        </Chip>
                                    }>
                                    {key.name}
                                </AutocompleteItem>
                            )}
                        </Autocomplete>

                    </div>
                )}
            </SortableFields>
        </div>
    )
}


export default CollectionProgressStateForm;


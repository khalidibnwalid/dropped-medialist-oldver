'use client'
import SmallImageUploader from "@/components/forms/small-imageUploader";
import SortableFields from "@/components/forms/sortableFields";
import type { itemProgressState } from "@/types/item";
import { Autocomplete, AutocompleteItem, Button, Checkbox, Chip, Divider, Input, Tooltip } from "@nextui-org/react";
import type { Key } from "react";
import { useContext, useState } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { EditCollectionPageContext } from "../page";
import type { CollectionData } from "@/types/collection";
import { useRef } from "react";
import { useEffect } from "react";

function EditCollFields() {

    const { control, setValue, getValues, errors, fieldTemplates } = useContext(EditCollectionPageContext)

    //prepare fields for values
    let mainFieldsNum = 0

    fieldTemplates?.mainFields && fieldTemplates.mainFields.forEach(() =>  mainFieldsNum++)

    let extraFieldsNum = 0

    fieldTemplates?.extraFields && fieldTemplates.extraFields.forEach(() => extraFieldsNum++)

    return (
        <>
            <div id="upper fields">
                <SortableFields
                    fieldControl={control}
                    fieldsNumber={mainFieldsNum}
                    fieldName="templates.fieldTemplates.mainFields"
                    startContent={({ addField }) => (
                        <div className="flex items-center justify-between">
                            <p className="text-zinc-500">Upper Fields (drag and drop)</p>
                            <div className="flex gap-x-2">
                                <Button
                                    onPress={() => { addField() }}
                                    className="hover:scale-105" isIconOnly
                                >
                                    <BiPlus className=" p-1 text-3xl" />
                                </Button>
                            </div>
                        </div>
                    )}
                >
                    {({ data, index, removeField, fieldControl }) => (

                        <div className="my-1 p-1 flex items-center gap-x-2 duration-200 md:flex-wrap rounded-md hover:bg-white/5" key={`mainField-${index}`}>

                            <Button onClick={() => removeField(index)} variant="light" isIconOnly>
                                <BiX className=" text-3xl" />
                            </Button>

                            <Controller
                                control={fieldControl}
                                name={`templates.fieldTemplates.mainFields[${index}].name`}
                                rules={{ required: true }}
                                render={({ field }) =>
                                    <Input isRequired className=" flex-grow shadow-sm rounded-xl" variant="bordered" type="text" label="Name" size="sm" {...field} />
                                } />

                            <Divider orientation="vertical" className="h-5" />

                            {getValues<any>(`templates.fieldTemplates.mainFields[${index}]`)?.bIsNumber ? //on resorting to presearve original values
                                <Tooltip content={
                                    <div className="px-1 py-2">
                                        <div className="text-small font-bold">Countable?</div>
                                        <div className="text-xs w-48"> When checked, the field gains a (+) and (-) buttons </div>
                                    </div>
                                }
                                    placement="right" color="foreground">
                                    <div>
                                        <Controller
                                            control={fieldControl}
                                            name={`templates.fieldTemplates.mainFields[${index}].bIsNumber`}
                                            render={({ field }) =>
                                                <Checkbox size="lg" defaultSelected={getValues<any>(`templates.fieldTemplates.mainFields[${index}]`)?.bIsNumber} className="flex-none" {...field} />
                                            } />
                                    </div>
                                </Tooltip>
                                :
                                <Tooltip content={
                                    <div className="px-1 py-2">
                                        <div className="text-small font-bold">Countable?</div>
                                        <div className="text-xs w-48"> When checked, the field gains a (+) and (-) buttons </div>
                                    </div>
                                }
                                    placement="right" color="foreground">
                                    <div>
                                        <Controller
                                            control={fieldControl}
                                            name={`templates.fieldTemplates.mainFields[${index}].bIsNumber`}
                                            render={({ field }) =>
                                                <Checkbox size="lg" className="flex-none" {...field} />
                                            } />
                                    </div>
                                </Tooltip>
                            }
                        </div>
                    )}
                </SortableFields>
            </div>

            <div id="lower fields">
                <SortableFields
                    fieldsNumber={extraFieldsNum}
                    fieldControl={control}
                    fieldName="templates.fieldTemplates.extraFields"
                    startContent={({ addField }) => (
                        <div className="flex items-center justify-between">
                            <p className="text-zinc-500">Lower Fields (drag and drop)</p>
                            <div className="flex gap-x-2">
                                <Button
                                    onPress={() => { addField() }}
                                    className="hover:scale-105" isIconOnly
                                >
                                    <BiPlus className=" p-1 text-3xl" />
                                </Button>
                            </div>
                        </div>
                    )}
                >
                    {({ data, index, removeField, fieldControl }) => (

                        <div className="my-1 p-1 flex items-center gap-x-2 duration-200 md:flex-wrap rounded-md hover:bg-white/5" key={`extraField-${index}`}>

                            <Button onClick={() => removeField(index)} variant="light" isIconOnly>
                                <BiX className=" text-3xl" />
                            </Button>

                            <Controller
                                control={fieldControl}
                                name={`templates.fieldTemplates.extraFields[${index}].name`}
                                rules={{ required: true }}
                                render={({ field }) =>
                                    <Input isRequired className=" flex-grow shadow-sm rounded-xl" variant="bordered" type="text" label="Name" size="sm" {...field} />
                                } />
                        </div>
                    )}
                </SortableFields>

            </div>


        </>
    )
}

export default EditCollFields
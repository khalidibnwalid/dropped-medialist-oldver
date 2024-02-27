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
import { LuImagePlus } from "react-icons/lu";

function EditCollBadgetsLinks() {

    const { control, setValue, getValues, errors, fieldTemplates } = useContext(EditCollectionPageContext)

    // useEffect(() => {
    //     if (typeof startFunction === 'function') {
    //         startFunction({ addField, defaultData, removeField });
    //     }
    // }, []);

    //handle Main /upper Fields
    let badgesNum = 0

    fieldTemplates?.badges && fieldTemplates.badges.forEach(() => badgesNum++)

    let linksNum = 0

    fieldTemplates?.links && fieldTemplates.links.forEach(() => linksNum++)

    return (
        <>
            <div id="Badges">
                <Divider className="w-full mb-7" />
                <SortableFields
                    fieldsNumber={badgesNum}
                    fieldControl={control}
                    fieldName="templates.fieldTemplates.badges"
                    startContent={({ addField }) => (
                        <div className="flex items-center justify-between">
                            <p className="text-zinc-500">Badges (drag and drop)</p>
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

                        <div className="my-1 p-1 flex items-center gap-x-2 duration-200 md:flex-wrap rounded-md hover:bg-white/5" key={`badge-${index}`}>

                            <Button onClick={() => removeField(index)} variant="light" isIconOnly>
                                <BiX className=" text-3xl" />
                            </Button>

                            <Controller
                                control={fieldControl}
                                name={`templates.fieldTemplates.badges[${index}].value`}
                                rules={{ required: true }}
                                render={({ field }) =>
                                    <Input
                                        isRequired
                                        className=" flex-grow shadow-sm rounded-xl"
                                        variant="bordered"
                                        type="text"
                                        label="Name"
                                        size="sm"
                                        {...field}
                                    />
                                } />

                            {getValues<any>(`templates.fieldTemplates.badges[${index}]`)?.logo_path && typeof (getValues<any>(`templates.fieldTemplates.badges[${index}]`)?.logo_path) === 'string' ?

                                <Controller
                                    control={control}
                                    name={`templates.fieldTemplates.badges[${index}].logo_path`}
                                    render={({ field }) =>
                                        <Button
                                            isDisabled
                                            className="
                                                          flex items-center justify-center h-10 w-10 aspect-1
                                                           shadow-sm rounded-xl bg-accented"
                                            isIconOnly
                                        >
                                            <LuImagePlus className="text-2xl" />
                                        </Button>

                                    }
                                />
                                :
                                <SmallImageUploader
                                    control={fieldControl}
                                    fieldName={`templates.fieldTemplates.badges[${index}].logo_path`}
                                    className='w-10 h-10 aspect-1'
                                />
                            }
                        </div>
                    )}
                </SortableFields>
            </div>

            <div id="Links">
                <Divider className="w-full mb-7" />
                <SortableFields
                    fieldsNumber={linksNum}
                    fieldControl={control}
                    fieldName="templates.fieldTemplates.links"
                    startContent={({ addField }) => (
                        <div className="flex items-center justify-between">
                            <p className="text-zinc-500">Links (drag and drop)</p>
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
                                name={`templates.fieldTemplates.links[${index}].name`}
                                rules={{ required: true }}
                                render={({ field }) =>
                                    <Input isRequired className=" flex-grow shadow-sm rounded-xl" variant="bordered" type="text" label="Label" size="sm" {...field} />
                                } />

                            {getValues<any>(`templates.fieldTemplates.links[${index}]`)?.logo_path && typeof (getValues<any>(`templates.fieldTemplates.links[${index}]`)?.logo_path) === 'string' ?

                                <Controller
                                    name={`templates.fieldTemplates.links[${index}].logo_path`}
                                    control={control}
                                    render={({ field }) =>
                                        <Button
                                            isDisabled
                                            className=" flex items-center justify-center h-10 w-10 aspect-1
                                            shadow-sm rounded-xl bg-accented"
                                            isIconOnly
                                        >
                                            <LuImagePlus className="text-2xl" />
                                        </Button>

                                    }
                                />
                                :
                                <SmallImageUploader
                                    control={fieldControl}
                                    fieldName={`templates.fieldTemplates.links[${index}].logo_path`}
                                    className='w-10 h-10 aspect-1'
                                />
                            }

                        </div>
                    )}
                </SortableFields>
            </div>
        </>
    )
}

export default EditCollBadgetsLinks
'use client'

import SortableFields from "@/components/forms/_components/sortableFields";
import { Button, Divider, Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { LuImagePlus } from "react-icons/lu";
import SmallImageUploader from "../../_components/Images/small-imageUploader";
import { ListFormContext } from "../provider";

function ListLinksForm() {
    const { control, getValues, fieldTemplates } = useContext(ListFormContext)

    return (
        <div id="Links">
            <Divider className="w-full mb-7" />
            <SortableFields
                fieldsNumber={fieldTemplates?.links?.length}
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

                    <div
                        className="my-1 p-1 flex items-center gap-x-2 duration-200 md:flex-wrap rounded-md hover:bg-white/5"
                        key={`mainField-${index}`}
                    >

                        <Button onClick={() => removeField(index)} variant="light" isIconOnly>
                            <BiX className=" text-3xl" />
                        </Button>

                        <Controller
                            control={fieldControl}
                            name={`templates.fieldTemplates.links[${index}].name`}
                            rules={{ required: true }}
                            render={({ field }) =>
                                <Input
                                    isRequired
                                    className=" flex-grow shadow-sm rounded-xl"
                                    variant="bordered"
                                    type="text"
                                    label="Label"
                                    size="sm"
                                    {...field}
                                />
                            } />

                        {getValues<any>(`templates.fieldTemplates.links[${index}]`)?.logo_path
                            && typeof (getValues<any>(`templates.fieldTemplates.links[${index}]`)?.logo_path) === 'string'
                            ? <Controller
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
                            : <SmallImageUploader
                                control={fieldControl}
                                fieldName={`templates.fieldTemplates.links[${index}].logo_path`}
                                className='w-10 h-10 aspect-1'
                            />
                        }

                    </div>
                )}
            </SortableFields>
        </div>
    )
}


export default ListLinksForm;


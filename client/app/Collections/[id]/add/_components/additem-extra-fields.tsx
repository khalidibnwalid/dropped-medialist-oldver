'use client'
import SortableFields from "@/components/forms/sortableFields";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Input } from "@nextui-org/react";
import { useContext, useState } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { IoGridOutline } from "react-icons/io5";
import { AddItemPageContext } from "../page";


function AddExtraFields() {

    const { control, fieldTemplates, setValue } = useContext(AddItemPageContext)
    const templates = fieldTemplates?.extraFields

    return (
        <SortableFields fieldControl={control} fieldName='extra_fields'
            startContent={({ addField, fieldsState }) => (
                <div className="flex items-center justify-between">
                    <p className="text-zinc-500">Lower Fields (drag and drop)</p>
                    <div className="flex gap-x-2">
                        <Dropdown backdrop="opaque">
                            <DropdownTrigger>
                                <Button className="hover:scale-105" isIconOnly>
                                    <IoGridOutline className=" p-1 text-3xl" />
                                    {/* dropmenu that deiplays configrations */}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Load Links templates" className="max-w-52 overflow-hidden">
                                <DropdownSection title="Templates">
                                    {templates ? templates.map((data, index) =>
                                        <DropdownItem
                                            key={`linktempl-${data.name}`}
                                            onPress={() => {
                                                setValue<any>(`extra_fields[${fieldsState.length === 0 ? 0 : fieldsState.length}].name`, data.name);
                                                addField()
                                            }}
                                        >
                                            {data.name}
                                        </DropdownItem>
                                    ) : []}
                                </DropdownSection>
                            </DropdownMenu>
                        </Dropdown>

                        <Button
                            onPress={() => addField()}
                            className="hover:scale-105" isIconOnly
                        >
                            <BiPlus className=" p-1 text-3xl" />
                        </Button>
                    </div>
                </div>
            )}>

            {({ data, index, removeField, fieldControl }) => (
                <div className="flex items-center gap-x-2
                    my-1 p-1 
                    rounded-md
                    duration-200 
                    md:flex-wrap hover:bg-white/5"
                    key={`extrafield-${index}`}
                >
                    <Button onClick={() => removeField(index)} variant="light" isIconOnly><BiX className=" text-3xl" /></Button>

                    <Controller
                        control={fieldControl}
                        name={`extra_fields[${index}].name`}
                        rules={{ required: true }}
                        render={({ field }) =>
                            <Input isRequired className=" flex-grow shadow-perfect-md" variant="bordered" type="text" label="Name" size="sm" {...field} />
                        } />

                    <span className="md:scale-0">:</span>

                    <Controller
                        control={fieldControl}
                        name={`extra_fields[${index}].value`}
                        render={({ field }) =>
                            <Input className=" flex-grow shadow-perfect-md" variant="bordered" type="text" label="Value" size="sm" {...field} />
                        } />
                </div>
            )}
        </SortableFields>
    )
}


export default AddExtraFields;


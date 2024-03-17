'use client'

import SortableFields from "@/components/forms/_components/sortableFields";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { IoGridOutline } from "react-icons/io5";
import { ItemFormContext } from "../provider";

function ItemExtraFieldsForm() {
    const { control, setValue, fieldTemplates, itemData } = useContext(ItemFormContext)
    const templates = fieldTemplates?.extraFields

    return (
        <SortableFields
            fieldsNumber={itemData?.extra_fields?.length}
            fieldControl={control}
            fieldName='extra_fields'
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
                            <DropdownMenu aria-label="Load Lower Fields templates" className="max-w-52 overflow-hidden">
                                <DropdownSection title="Templates">
                                    {templates ? templates.map((data, index) =>
                                        <DropdownItem
                                            key={'extrafieldtempl-' + data.name}
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
                <div className="sortableFieldContainer" key={'extrafield-' + index} >
                    <Button onClick={() => removeField(index)} variant="light" isIconOnly><BiX className=" text-3xl" /></Button>

                    <Controller
                        control={fieldControl}
                        name={`extra_fields[${index}].name`}
                        rules={{ required: true }}
                        render={({ field }) =>
                            <Input isRequired className=" flex-grow shadow-sm rounded-xl" variant="bordered" type="text" label="Name" size="sm" {...field} />
                        } />

                    <span className="md:scale-0">:</span>

                    <Controller
                        control={fieldControl}
                        name={`extra_fields[${index}].value`}
                        render={({ field }) =>
                            <Input className=" flex-grow shadow-sm rounded-xl" variant="bordered" type="text" label="Value" size="sm" {...field} />
                        } />
                </div>
            )}
        </SortableFields>
    )
}


export default ItemExtraFieldsForm;


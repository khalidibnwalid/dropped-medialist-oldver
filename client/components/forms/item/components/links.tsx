'use client'

import SmallImageUploader from "@/components/forms/_components/Images/small-imageUploader";
import SortableFields from "@/components/forms/_components/sortableFields";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { IoGridOutline } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import { ItemFormContext } from "../provider";

function ItemLinkForm() {
    const { control, setValue, getValues, fieldTemplates, errors, itemData } = useContext(ItemFormContext)
    const templates = fieldTemplates?.links

    return (
        <div className="grid grid-cols-1">
            <SortableFields
                fieldsNumber={itemData?.links?.length}
                fieldControl={control}
                fieldName='links'
                startContent={({ addField, fieldsState }) => (
                    <div className="flex items-center justify-between">

                        <p className="text-zinc-500">Links (drag and drop)</p>
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
                                                key={'linktempl-' + data.name}
                                                onPress={() => {
                                                    setValue<any>(`links[${fieldsState.length === 0 ? 0 : fieldsState.length}].name`, data.name)
                                                    setValue<any>(`links[${fieldsState.length === 0 ? 0 : fieldsState.length}].logo_path`, data?.logo_path)
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
                                onPress={() => {
                                    addField()
                                }}
                                className="hover:scale-105" isIconOnly
                            >
                                <BiPlus className=" p-1 text-3xl" />
                            </Button>
                        </div>
                    </div>
                )}>

                {({ data, index, removeField, fieldControl }) => (
                    <div className="sortableFieldContainer" key={'linkfield-' + index} >

                        <Button onClick={() => removeField(index)} variant="light" isIconOnly><BiX className=" text-3xl" /></Button>

                        <Controller
                            control={fieldControl}
                            name={`links[${index}].name`}
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

                        <Controller
                            control={fieldControl}
                            name={`links[${index}].url`}
                            rules={{
                                required: true,
                                pattern: {
                                    value: /^(http|https):\/\/[^ "]+$/i,
                                    message: 'Please enter a valid URL',
                                }
                            }}
                            render={({ field }) =>
                                <Input
                                    isInvalid={errors.links?.[index]?.url && true}
                                    color={errors.links?.[index]?.url && "danger"}
                                    isRequired
                                    errorMessage={errors.links?.[index]?.url?.message}
                                    className=" flex-grow shadow-sm rounded-xl"
                                    variant="bordered"
                                    type="text"
                                    label="URL Link"
                                    size="sm"
                                    {...field}
                                />
                            } />

                        {getValues<any>(`links[${index}]`)?.logo_path && typeof (getValues<any>(`links[${index}]`)?.logo_path) === 'string' ?

                            <Controller
                                name={`links[${index}].logo_path`}
                                control={control}
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
                                fieldName={`links[${index}].logo_path`}
                                className='w-10 h-10 aspect-1'
                            />
                        }

                    </div>
                )
                }
            </SortableFields >
        </div >
    )
}



export default ItemLinkForm;



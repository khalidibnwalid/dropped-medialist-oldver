'use client'
import SmallImageUploader from "@/components/forms/small-imageUploader";
import SortableFields from "@/components/forms/sortableFields";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Input } from "@nextui-org/react";
import { useContext, useRef, useState } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { IoGridOutline } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import { EditItemPageContext } from "../page";
import { useMemo } from "react";


function EditLinksFields() {

    const { control, setValue, getValues, fieldTemplates, itemData, errors } = useContext(EditItemPageContext)
    const templates = fieldTemplates?.links

    let linksNum = 0
    itemData?.links?.forEach(() => {
        linksNum++
    })

    return (
        <div className="grid grid-cols-1">
            <SortableFields
                fieldsNumber={linksNum}
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
                                                key={`linktempl-${data.name}`}
                                                onPress={() => {
                                                    setValue<any>(`links[${fieldsState.length === 0 ? 0 : fieldsState.length}].name`, data.name)
                                                    if (data?.logo_path) {
                                                        setValue<any>(`links[${fieldsState.length === 0 ? 0 : fieldsState.length}].logo_path`, data.logo_path)
                                                    } else {
                                                        setValue<any>(`links[${fieldsState.length === 0 ? 0 : fieldsState.length}].logo_path`, undefined)
                                                    }
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
                    <div className="flex items-center gap-x-2
                                    my-1 p-1 
                                    rounded-md
                                    duration-200 
                                    md:flex-wrap hover:bg-white/5"
                        key={`linkfield-${index}`}
                    >

                        <Button onClick={() => removeField(index)} variant="light" isIconOnly><BiX className=" text-3xl" /></Button>

                        <Controller
                            control={fieldControl}
                            name={`links[${index}].name`}
                            rules={{ required: true }}
                            render={({ field }) =>
                                <Input
                                    isRequired
                                    className=" flex-grow shadow-perfect-md"
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
                                    value: /^(ftp|http|https):\/\/[^ "]+$/i,
                                    message: 'Please enter a valid URL',
                                }
                            }}
                            render={({ field }) =>
                                <Input
                                    isInvalid={errors.links?.[index]?.url ? true : false}
                                    color={errors.links?.[index]?.url ? "danger" : "default"}
                                    isRequired
                                    errorMessage={errors.links?.[index]?.url && "Please enter a valid link"}
                                    className=" flex-grow shadow-perfect-md"
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
                                                   shadow-perfect-md bg-[#282828]"
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



export default EditLinksFields;



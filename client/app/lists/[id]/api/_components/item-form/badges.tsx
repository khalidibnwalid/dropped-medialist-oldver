'use client'

import SortableFields from "@/components/forms/_components/sortableFields";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import { IoGridOutline } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import { ItemApiTemplateContext } from "../../provider";

function ItemApiBadges() {
    const { control, setValue, getValues, errors, fieldTemplates, pattern, currentApiTemplate } = useContext(ItemApiTemplateContext)

    const templates = fieldTemplates?.badges

    return (
        <div className="grid grid-cols-1">
            <SortableFields
                fieldsNumber={currentApiTemplate?.template?.badges?.length}
                fieldControl={control}
                fieldName='template.badges'
                startContent={({ addField, fieldsState }) => (
                    <div className="flex items-center justify-between">

                        <p className="text-zinc-500">Badges (drag and drop)</p>
                        <div className="flex gap-x-2">
                            <Dropdown backdrop="opaque">
                                <DropdownTrigger>
                                    <Button className="hover:scale-105" isIconOnly>
                                        <IoGridOutline className=" p-1 text-3xl" />
                                        {/* dropmenu that deiplays configrations */}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Load badges templates" className="max-w-52 overflow-hidden">
                                    <DropdownSection title="Original">
                                        <DropdownItem
                                            key='badgestempl-Rating'
                                            onPress={() => {
                                                setValue<any>(`template.badges[${fieldsState.length === 0 ? 0 : fieldsState.length}].logo_path`, "star")
                                                setValue<any>(`template.badges[${fieldsState.length === 0 ? 0 : fieldsState.length}].value`, "star")
                                                addField()
                                            }}
                                        >
                                            <FaStar className="float-start mr-1 mt-[0.15rem]" /> Rating
                                        </DropdownItem>
                                    </DropdownSection>
                                    <DropdownSection title="Templates">
                                        {templates ? templates.map((data, index) =>
                                            <DropdownItem
                                                key={'badgestempl-' + data.value}
                                                onPress={() => {
                                                    setValue<any>(`template.badges[${fieldsState.length === 0 ? 0 : fieldsState.length}].value`, data.value)
                                                    setValue<any>(`template.badges[${fieldsState.length === 0 ? 0 : fieldsState.length}].logo_path`, data?.logo_path)
                                                    addField()
                                                }}
                                            >
                                                {data.value}
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
                    <div className="sortableFieldContainer" key={'badge-' + index} >

                        <Button onClick={() => removeField(index)} variant="light" isIconOnly>
                            <BiX className=" text-3xl" />
                        </Button>

                        <Controller
                            defaultValue={() => getValues<any>(`template.badges[${index}]`)?.value || undefined}
                            control={fieldControl}
                            name={`template.badges[${index}].value`}
                            rules={{ required: true, pattern }}
                            render={({ field }) =>
                                <Input
                                    isInvalid={errors.template?.badges?.[index]?.value && true}
                                    color={errors.template?.badges?.[index]?.value && "danger"}
                                    errorMessage={errors.template?.badges?.[index]?.value?.message}
                                    isRequired
                                    className=" flex-grow shadow-sm rounded-xl"
                                    variant="bordered"
                                    type="text"
                                    label="Label"
                                    size="sm"
                                    {...field}
                                />
                            } />

                        <Controller
                            name={`template.badges[${index}].logo_path`}
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

                    </div>
                )
                }
            </SortableFields >
        </div >
    )
}


export default ItemApiBadges;


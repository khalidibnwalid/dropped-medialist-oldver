'use client'

import SmallImageUploader from "@/components/forms/_components/Images/small-imageUploader";
import SortableFields from "@/components/forms/_components/sortableFields";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import { IoGridOutline } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import { ItemFormContext } from "../provider";

function ItemBadgesForm() {
    const { control, setValue, getValues, fieldTemplates, itemData } = useContext(ItemFormContext)

    const templates = fieldTemplates?.badges

    return (
        <div className="grid grid-cols-1">
            <SortableFields
                fieldsNumber={itemData?.badges?.length}
                fieldControl={control}
                fieldName='badges'
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
                                            key='linktempl-Rating'
                                            onPress={() => {
                                                setValue<any>(`badges[${fieldsState.length === 0 ? 0 : fieldsState.length}].logo_path`, "star")
                                                setValue<any>(`badges[${fieldsState.length === 0 ? 0 : fieldsState.length}].value`, "star")
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
                                                    setValue<any>(`badges[${fieldsState.length === 0 ? 0 : fieldsState.length}].value`, data.value)
                                                    setValue<any>(`badges[${fieldsState.length === 0 ? 0 : fieldsState.length}].logo_path`, data?.logo_path)
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
                            defaultValue={() => getValues<any>(`badges[${index}]`)?.value || undefined}
                            control={fieldControl}
                            name={`badges[${index}].value`}
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

                        {getValues<any>(`badges[${index}]`)?.logo_path && typeof (getValues<any>(`badges[${index}]`)?.logo_path) === 'string' ?

                            <Controller
                                name={`badges[${index}].logo_path`}
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
                                fieldName={`badges[${index}].logo_path`}
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


export default ItemBadgesForm;


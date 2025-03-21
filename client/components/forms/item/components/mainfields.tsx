'use client'
import SortableFields from "@/components/forms/_components/sortableFields";
import { Button, Checkbox, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Input, Tooltip } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { IoGridOutline } from "react-icons/io5";
import { ItemFormContext } from "../provider";


function ItemMainFieldsForm() {

    const { control, fieldTemplates, getValues, setValue, itemData } = useContext(ItemFormContext)
    const templates = fieldTemplates?.mainFields

    return (
        <div className="grid grid-cols-1">
            <SortableFields
                fieldsNumber={itemData?.main_fields?.length}
                fieldControl={control}
                fieldName='main_fields'
                startContent={({ addField, fieldsState }) => (
                    <div className="flex items-center justify-between">
                        <p className="text-zinc-500">Upper Fields (drag and drop)</p>
                        <div className="flex gap-x-2">
                            <Dropdown backdrop="opaque">
                                {/* dropmenu that deiplays configrations */}
                                <DropdownTrigger>
                                    <Button className="hover:scale-105" isIconOnly>
                                        <IoGridOutline className=" p-1 text-3xl" />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Load Links templates" className="max-w-52 overflow-hidden">
                                    <DropdownSection title="Templates">
                                        {templates ? templates.map((data, index) =>
                                            <DropdownItem
                                                key={'maintempltempl-' + data.name}
                                                onPress={() => {
                                                    setValue<any>(`main_fields[${fieldsState.length === 0 ? 0 : fieldsState.length}].name`, data.name)
                                                    setValue<any>(`main_fields[${fieldsState.length === 0 ? 0 : fieldsState.length}].bIsNumber`, data.bIsNumber)
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
                    <div className="sortableFieldContainer" key={'mainfield-' + index} >
                        <Button onClick={() => removeField(index)} variant="light" isIconOnly><BiX className=" text-3xl" /></Button>

                        <Controller
                            control={fieldControl}
                            name={`main_fields[${index}].name`}
                            rules={{ required: true }}
                            render={({ field }) =>
                                <Input isRequired className=" flex-grow shadow-sm rounded-xl" variant="bordered" type="text" label="Name" size="sm" {...field} />
                            } />

                        <span className="md:scale-0">:</span>

                        <Controller
                            control={fieldControl}
                            name={`main_fields[${index}].value`}
                            render={({ field }) =>
                                <Input className=" flex-grow shadow-sm rounded-xl" variant="bordered" type="text" label="Value" size="sm" {...field} />
                            } />


                        {getValues<any>(`main_fields[${index}]`)?.bIsNumber ? //on resorting to presearve original values
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
                                        name={`main_fields[${index}].bIsNumber`}
                                        render={({ field }) =>
                                            <Checkbox size="lg" defaultSelected={getValues<any>(`main_fields[${index}]`)?.bIsNumber} className="flex-none" {...field} />
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
                                        name={`main_fields[${index}].bIsNumber`}
                                        render={({ field }) =>
                                            <Checkbox size="lg" defaultSelected={getValues<any>(`main_fields[${index}]`)?.bIsNumber} className="flex-none" {...field} />
                                        } />
                                </div>
                            </Tooltip>
                        }


                    </div>
                )}
            </SortableFields>
        </div>
    )
}


export default ItemMainFieldsForm;


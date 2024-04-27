import SortableFields from "@/components/forms/_components/sortableFields";
import { Button, Checkbox, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Input, Tooltip } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { IoGridOutline } from "react-icons/io5";
import { ItemApiTemplateContext } from "../provider";


function ItemApiMainFields() {

    const { control, fieldTemplates, getValues, setValue, pattern, errors, currentApiTemplate } = useContext(ItemApiTemplateContext)
    const templates = fieldTemplates?.mainFields

    return (
        <div className="grid grid-cols-1">
            <SortableFields
                fieldsNumber={currentApiTemplate?.template?.main_fields?.length}
                fieldControl={control}
                fieldName='template.main_fields'
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
                                                    setValue<any>(`template.main_fields[${fieldsState.length === 0 ? 0 : fieldsState.length}].name`, data.name)
                                                    setValue<any>(`template.main_fields[${fieldsState.length === 0 ? 0 : fieldsState.length}].bIsNumber`, data.bIsNumber)
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
                            name={`template.main_fields[${index}].name`}
                            rules={{ required: true, pattern }}
                            render={({ field }) =>
                                <Input
                                    isInvalid={errors.template?.main_fields?.[index]?.name && true}
                                    color={errors.template?.main_fields?.[index]?.name && "danger"}
                                    errorMessage={errors.template?.main_fields?.[index]?.name?.message}
                                    isRequired
                                    className=" flex-grow shadow-sm rounded-xl"
                                    variant="bordered"
                                    type="text"
                                    label="Name"
                                    size="sm"
                                    {...field}
                                />
                            } />

                        <span className="md:scale-0">:</span>

                        <Controller
                            control={fieldControl}
                            name={`template.main_fields[${index}].value`}
                            rules={{ pattern }}
                            render={({ field }) =>
                                <Input
                                    isInvalid={errors.template?.main_fields?.[index]?.value && true}
                                    color={errors.template?.main_fields?.[index]?.value && "danger"}
                                    errorMessage={errors.template?.main_fields?.[index]?.value?.message}
                                    className=" flex-grow shadow-sm rounded-xl"
                                    variant="bordered"
                                    type="text"
                                    label="Value"
                                    size="sm"
                                    {...field}
                                />
                            } />


                        {getValues<any>(`template.main_fields[${index}]`)?.bIsNumber ? //on resorting to presearve original values
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
                                        name={`template.main_fields[${index}].bIsNumber`}
                                        render={({ field }) =>
                                            <Checkbox size="lg"
                                                defaultSelected={getValues<any>(`template.main_fields[${index}]`)?.bIsNumber}
                                                className="flex-none" {...field}
                                            />
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
                                        name={`template.main_fields[${index}].bIsNumber`}
                                        render={({ field }) =>
                                            <Checkbox size="lg" defaultSelected={getValues<any>(`template.main_fields[${index}]`)?.bIsNumber} className="flex-none" {...field} />
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


export default ItemApiMainFields;


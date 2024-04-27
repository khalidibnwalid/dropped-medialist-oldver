import SortableFields from "@/components/forms/_components/sortableFields";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { IoGridOutline } from "react-icons/io5";
import { ItemApiTemplateContext } from "../provider";

function ItemApiExtraFields() {
    const { control, setValue, fieldTemplates, pattern, errors, currentApiTemplate } = useContext(ItemApiTemplateContext)
    const templates = fieldTemplates?.extraFields

    return (
        <SortableFields
            fieldsNumber={currentApiTemplate?.template?.extra_fields?.length}
            fieldControl={control}
            fieldName='template.extra_fields'
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
                                                setValue<any>(`template.extra_fields[${fieldsState.length === 0 ? 0 : fieldsState.length}].name`, data.name);
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
                        name={`template.extra_fields[${index}].name`}
                        rules={{ required: true, pattern }}
                        render={({ field }) =>
                            <Input
                                isInvalid={errors.template?.extra_fields?.[index]?.name && true}
                                color={errors.template?.extra_fields?.[index]?.name && "danger"}
                                errorMessage={errors.template?.extra_fields?.[index]?.name?.message}
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
                        name={`template.extra_fields[${index}].value`}
                        rules={{ required: true, pattern }}
                        render={({ field }) =>
                            <Input
                                isInvalid={errors.template?.extra_fields?.[index]?.value && true}
                                color={errors.template?.extra_fields?.[index]?.value && "danger"}
                                errorMessage={errors.template?.extra_fields?.[index]?.value?.message}
                                className=" flex-grow shadow-sm rounded-xl"
                                variant="bordered"
                                type="text"
                                label="Value"
                                size="sm"
                                {...field}
                            />
                        } />
                </div>
            )}
        </SortableFields>
    )
}


export default ItemApiExtraFields;


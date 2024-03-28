'use client'

import SortableFields from "@/components/forms/_components/sortableFields";
import { Button, Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { ItemApiTemplateContext } from "../../provider";
import { RxSlash } from "react-icons/rx";

function ItemApiRoutes() {
    const { control, errors, pathRegex, pattern, setValue, fieldTemplates, currentApiTemplate } = useContext(ItemApiTemplateContext)

    return (
        <div>

            <SortableFields
                fieldsNumber={currentApiTemplate?.routes?.length}
                fieldControl={control}
                fieldName='routes'
                startContent={({ addField, fieldsState }) => (
                    <div className="flex items-center justify-between">
                        <p className="text-zinc-500">Routes (drag and drop)</p>
                        <Button
                            onPress={() => addField()}
                            className="hover:scale-105" isIconOnly
                        >
                            <BiPlus className=" p-1 text-3xl" />
                        </Button>
                    </div>
                )}>

                {({ data, index, removeField, fieldControl }) => (
                    <div className="sortableFieldContainer" key={'routeTemplate-' + index} >
                        <Button onClick={() => removeField(index)} variant="light" isIconOnly>
                            <BiX className=" text-3xl" />
                        </Button>

                        <Controller
                            control={fieldControl}
                            name={`routes[${index}].name`}
                            rules={{ required: true, pattern }}
                            render={({ field }) =>
                                <Input
                                    isInvalid={errors.routes?.[index]?.name && true}
                                    color={errors.routes?.[index]?.name && "danger"}
                                    errorMessage={errors.routes?.[index]?.name?.message}
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
                            name={`routes[${index}].route`}
                            rules={{ required: true, pattern }}
                            render={({ field }) =>
                                <Input
                                    isInvalid={errors.routes?.[index]?.route && true}
                                    color={errors.routes?.[index]?.route && "danger"}
                                    errorMessage={errors.routes?.[index]?.route?.message}
                                    startContent={<RxSlash className="text-zinc-500" />}
                                    endContent={<RxSlash className="text-zinc-500" />}
                                    isRequired
                                    className=" flex-grow shadow-sm rounded-xl"
                                    variant="bordered"
                                    type="text"
                                    label="Route"
                                    size="sm"
                                    {...field}
                                />
                            } />
                    </div>
                )}
            </SortableFields>
        </div>
    )
}


export default ItemApiRoutes;


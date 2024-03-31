'use client'

import SortableFields from "@/components/forms/_components/sortableFields";
import { Button, Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { ItemApiTemplateContext } from "../../provider";

function ItemApiQueries() {
    const { control, errors, currentApiTemplate, queryPattern } = useContext(ItemApiTemplateContext)



    return (
        <div>

            <SortableFields
                fieldsNumber={currentApiTemplate?.queries?.length}
                fieldControl={control}
                fieldName='queries'
                startContent={({ addField }) => (
                    <div className="flex items-center justify-between">
                        <p className="text-zinc-500">Queries (drag and drop)</p>
                        <Button
                            onPress={() => addField()}
                            className="hover:scale-105" isIconOnly
                        >
                            <BiPlus className=" p-1 text-3xl" />
                        </Button>
                    </div>
                )}>

                {({ index, removeField, fieldControl }) => (
                    <div className="sortableFieldContainer" key={'queryTemplate-' + index} >
                        <Button onClick={() => removeField(index)} variant="light" isIconOnly>
                            <BiX className=" text-3xl" />
                        </Button>

                        <Controller
                            control={fieldControl}
                            name={`queries[${index}].name`}
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

                        <span className="md:scale-0">:</span>

                        <Controller
                            control={fieldControl}
                            name={`queries[${index}].query`}
                            rules={{ pattern: queryPattern }}
                            render={({ field }) =>
                                <Input
                                    isInvalid={errors.queries?.[index]?.query && true}
                                    color={errors.queries?.[index]?.query && "danger"}
                                    errorMessage={errors.queries?.[index]?.query?.message}
                                    className=" flex-grow shadow-sm rounded-xl"
                                    variant="bordered"
                                    type="text"
                                    label="Query"
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


export default ItemApiQueries;


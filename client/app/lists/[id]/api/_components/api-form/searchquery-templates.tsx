'use client'

import SortableFields from "@/components/forms/_components/sortableFields";
import { Button, Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { ItemApiTemplateContext } from "../../provider";

function ItemApisearchQueries() {
    const { control, errors, pathRegex, pattern, setValue, fieldTemplates, searchIsAllowed } = useContext(ItemApiTemplateContext)

    return (
        <div>

            <SortableFields
                // fieldsNumber={?.length}
                fieldControl={control}
                fieldName='searchQueries'
                startContent={({ addField, fieldsState }) => (
                    <div className="flex items-center justify-between">
                        <p className={searchIsAllowed ? "text-zinc-500" : "text-zinc-600"}>Search Queries (drag and drop)</p>
                        <Button
                            isDisabled={!searchIsAllowed}
                            onPress={() => addField()}
                            className="hover:scale-105" isIconOnly
                        >
                            <BiPlus className=" p-1 text-3xl" />
                        </Button>
                    </div>
                )}>

                {({ data, index, removeField, fieldControl }) => (
                    <div className="sortableFieldContainer" key={'searchQueryTemplate-' + index} >
                        <Button
                            isDisabled={!searchIsAllowed}
                            onClick={() => removeField(index)}
                            variant="light"
                            isIconOnly
                        >
                            <BiX className=" text-3xl" />
                        </Button>
                        <Controller
                            disabled={!searchIsAllowed}
                            control={fieldControl}
                            name={`searchQueries[${index}].name`}
                            rules={{ required: true, pattern }}
                            render={({ field }) =>
                                <Input
                                    isDisabled={!searchIsAllowed}
                                    isInvalid={errors.searchQueries?.[index]?.name && true}
                                    color={errors.searchQueries?.[index]?.name && "danger"}
                                    errorMessage={errors.searchQueries?.[index]?.name?.message}
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
                            disabled={!searchIsAllowed}
                            control={fieldControl}
                            name={`searchQueries[${index}].query`}
                            rules={{ required: true, pattern }}
                            render={({ field }) =>
                                <Input
                                    isDisabled={!searchIsAllowed}
                                    isInvalid={errors.searchQueries?.[index]?.query && true}
                                    color={errors.searchQueries?.[index]?.query && "danger"}
                                    errorMessage={errors.searchQueries?.[index]?.query?.message}
                                    isRequired
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


export default ItemApisearchQueries;


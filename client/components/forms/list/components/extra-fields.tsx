'use client'

import SortableFields from "@/components/forms/_components/sortableFields";
import { Button, Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { ListFormContext } from "../provider";

function ListExtraFieldsForm() {
    const { control, fieldTemplates } = useContext(ListFormContext)

    return (
        <div id="lower fields">
            <SortableFields
                fieldsNumber={fieldTemplates?.extraFields?.length}
                fieldControl={control}
                fieldName="templates.fieldTemplates.extraFields"
                startContent={({ addField }) => (
                    <div className="flex items-center justify-between">
                        <p className="text-zinc-500">Lower Fields (drag and drop)</p>
                        <div className="flex gap-x-2">
                            <Button
                                onPress={() => { addField() }}
                                className="hover:scale-105" isIconOnly
                            >
                                <BiPlus className=" p-1 text-3xl" />
                            </Button>
                        </div>
                    </div>
                )}
            >
                {({ data, index, removeField, fieldControl }) => (

                    <div className="sortableFieldContainer" key={`extraField-${index}`}>

                        <Button onClick={() => removeField(index)} variant="light" isIconOnly>
                            <BiX className=" text-3xl" />
                        </Button>

                        <Controller
                            control={fieldControl}
                            name={`templates.fieldTemplates.extraFields[${index}].name`}
                            rules={{ required: true }}
                            render={({ field }) =>
                                <Input isRequired className=" flex-grow shadow-sm rounded-xl" variant="bordered" type="text" label="Name" size="sm" {...field} />
                            } />
                    </div>
                )}
            </SortableFields>
        </div>
    )
}


export default ListExtraFieldsForm;


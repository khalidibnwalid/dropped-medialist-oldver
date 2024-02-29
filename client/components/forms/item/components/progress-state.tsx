'use client'

import type { itemProgressState } from "@/types/item";
import { Autocomplete, AutocompleteItem, Chip } from "@nextui-org/react";
import type { Key } from "react";
import { useContext, useEffect, useState } from "react";
import { ItemFormContext } from "../provider";

function ItemProgressStateForm() {
    const { fieldTemplates, setValue, itemData } = useContext(ItemFormContext)
    const [autoCompleteValue, setAutoCompleteValue] = useState<any>(itemData?.progress_state?.name); //autocomplete's current value
    const [templates, setTemplates] = useState<itemProgressState[]>([])

    useEffect(() => {
        if (fieldTemplates?.states && fieldTemplates?.states.length > 0) {
            setTemplates(fieldTemplates.states);
        }
    }, [fieldTemplates]); //to get templates safely

    const key_to_field = (key: Key) => templates?.find((state) => state.name === key)

    return (
        <div className="flex items-center lg:flex-wrap">
            <p className="text-zinc-500 flex-none text-lg">Progress State </p>
            <Autocomplete
                aria-label="select progress state"
                defaultItems={templates}
                label=""
                labelPlacement="outside"
                className="flex-grow ml-3"
                size="sm"
                variant="bordered"
                selectedKey={autoCompleteValue}
                onSelectionChange={(key: Key) => { setAutoCompleteValue(key); setValue('progress_state', key_to_field(key)) }}
            >
                {(data) => (
                    <AutocompleteItem
                        key={data.name}
                        endContent={
                            <Chip
                                radius="lg"
                                color={data.color}
                                className="w-5 h-5"
                            >
                            </Chip>
                        }>
                        {data.name}
                    </AutocompleteItem>
                )}
            </Autocomplete>


        </div>
    )
}


export default ItemProgressStateForm;


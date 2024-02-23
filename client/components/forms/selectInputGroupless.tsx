'use client'

import { Autocomplete, AutocompleteItem, Button, Chip } from "@nextui-org/react";
import { KeyboardEvent, MouseEvent, useRef, useState } from "react";
import { Control, useFieldArray } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";


export interface selectDataSet {
    id: string;
    name: string
    [key: string]: string;

}

function SelectInput({ fieldControl, dataSet, fieldName }: { fieldControl: Control, dataSet: dataSet[], fieldName: string }) {
    const { append, remove, replace } = useFieldArray({ //field
        control: fieldControl,
        name: fieldName
    });

    const [autoCompleteValue, setAutoCompleteValue] = useState(""); //autocomplete's current value
    const [currentSelected, setCurrentSelected] = useState<string[]>([] as string[]); //current added tags' array
    const autocompleteRef = useRef<HTMLInputElement>(null)

    function addSelected(event: MouseEvent<HTMLButtonElement>) {

        const input = autocompleteRef.current?.value.trim() // space can cause problems such as adding a " " blank tag by wrong

        if (currentSelected.some((value) => (value === autoCompleteValue || value === input))
            || autoCompleteValue == "" && input == "") {

            return //to ignore if you want to re-add the same tag or put an empty field

        } else if (dataSet.some((data: dataSet) => (data.name === autoCompleteValue))
            || dataSet.some((data: dataSet) => (data.name === input))) {

            // if the tag exists
            const newSelectedArray = [...currentSelected, autoCompleteValue] //create a new array that includes the new value
            append(autoCompleteValue)
            setCurrentSelected(newSelectedArray)
            setAutoCompleteValue("")

        } else {
            // new tag that doesn't exist
            const newSelectedArray = [...currentSelected, input] //create a new array that includes the new value
            append(input)
            setCurrentSelected(newSelectedArray)

        }

    }

    function removeSelected(selected: number | string) {
        const newSelected = currentSelected.filter((value) => value !== selected)
        setCurrentSelected(newSelected)
        remove(Number(selected))

    }

    function onKeyEvent(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            addSelected(event)
        }
    }


    const headingClasses = "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small";

    return (
        <>
            <div className="grid grid-cols-1 gap-y-2">

                <div className="flex w-ful gap-2 items-center">
                    <Autocomplete
                        ref={autocompleteRef}
                        placeholder="Add Tags"
                        aria-label="select Tags"
                        className="flex grow"
                        size="sm"
                        variant="bordered"
                        scrollShadowProps={{
                            isEnabled: false
                        }}
                        isClearable={false}
                        onKeyDown={onKeyEvent}
                        defaultItems={dataSet}
                        selectedKey={autoCompleteValue}
                        onSelectionChange={setAutoCompleteValue}
                    >
                        {dataSet.map((selected: dataSet) => (
                            <AutocompleteItem key={selected.name}>{selected.name}</AutocompleteItem>
                        ))}
                    </Autocomplete>
                    <Button onClick={addSelected} className="flex-none hover:scale-105" isIconOnly>
                        <BiPlus className=" p-1 text-3xl" />
                    </Button>
                </div>

                {(currentSelected.length != 0) &&
                    <button
                        type="button"
                        className=" text-sm text-start flex items-center px-5 text-[#858484] animate-fade-in origin-top"
                        onClick={() => { setCurrentSelected([]); replace([]); }}
                    >
                        <BiX className="text-lg" /> remove all
                    </button>
                }

                <div>
                    {currentSelected?.map((tagName) => (
                        <>
                            <Chip className="m-1 animate-fade-in" key={`tagchip-${tagName}`}
                                onClose={() => removeSelected(tagName)}
                            >
                                {tagName}
                            </Chip>
                        </>
                    ))}
                </div>


            </div>

        </>
    )
}


export default SelectInput;

'use client'

import { IMG_PATH } from "@/app/page";
import { itemData } from "@/types/item";
import { Autocomplete, AutocompleteItem, Button, Card, Chip, Image } from "@nextui-org/react";
import type { Key } from "react";
import { KeyboardEvent, useContext, useEffect, useRef, useState } from "react";
import { useFieldArray } from 'react-hook-form';
import { BiPlus, BiX } from "react-icons/bi";
import { ItemFormContext } from "../provider";

function ItemRelatedItemsForm({ dataSet }: { dataSet: itemData[] }) {
    const { control, itemData } = useContext(ItemFormContext)
    const { append, remove } = useFieldArray({
        control,
        name: "related"
    });

    //use replace for default fields????

    const [autoCompleteValue, setAutoCompleteValue] = useState(""); //autocomplete's current value
    const [currentItems, setCurrentItems] = useState<string[]>([] as string[]);
    const autocompleteRef = useRef<HTMLInputElement>(null)

    function name_to_id(name: Key | string) {
        const item = dataSet.find((data) => (data.title == name));
        return item?.id || null;

    }

    function id_to_name(id: Key | string) {
        const item = dataSet.find((data) => (data.id == id));
        return item?.title || null;

    }

    useEffect(() => {
        if (itemData?.related && itemData?.related?.length > 0) {
            const originalRelatedItems = itemData.related.map((id) => {
                append(id)
                const name = id_to_name(id)
                return name || undefined
            }).filter(item => item != undefined)
            setCurrentItems(originalRelatedItems)
        }
    }, []);

    function addItem(key?: Key) {
        let currentValue = key || autoCompleteValue
        if (currentItems.some((value) => (value === currentValue))) {
            autocompleteRef.current?.blur()
            return //to ignore if you want to re-add the same item

        } else if (dataSet.some((data: itemData) => (data.title === currentValue))) {
            // if the tag exists
            const newItemsArray = [...currentItems, currentValue] //create a new array that includes the new values
            append(name_to_id(currentValue))
            setCurrentItems(newItemsArray)
            setAutoCompleteValue("")
            autocompleteRef.current?.blur()
        }

    }

    function removeItem(item: string) {
        const newitems = currentItems.filter((value) => value !== item)
        setCurrentItems(newitems)
        const index = currentItems.indexOf(item)
        remove(index)
        // 'id' in useFieldsArray and 'item' in currentItems both have the same index, 
        // so getting one of the is enaugh to delete the other.
    }

    //set a debouncer?
    function onKeyEvent(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            addItem()
        }
    }

    return (
        <>
            <p className="text-zinc-500">Related Items</p>

            <div className="grid grid-cols-1 gap-y-2">

                <div className="flex w-ful gap-2 items-center">
                    <Autocomplete
                        ref={autocompleteRef}
                        placeholder="Add Related Items"
                        aria-label="select Items"
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
                        onSelectionChange={addItem}
                    >
                        {(data: itemData) =>
                            <AutocompleteItem
                                key={data.title}
                                startContent={data.poster_path ?
                                    <Image
                                        className="flex-shrink-0 h-10 aspect-1 object-cover"
                                        alt={data.title}
                                        src={`${IMG_PATH}/images/items/${data.poster_path}`}
                                    /> :
                                    <Card
                                        className="uppercase font-light text-xl 
                                               aspect-1 h-10
                                               items-center justify-center 
                                              bg-[#2f2f2f]"

                                        radius="lg"
                                    >
                                        {data.title[0]}
                                    </Card>
                                }
                            >
                                {data.title}
                            </AutocompleteItem>
                        }
                    </Autocomplete>
                    <Button onClick={addItem} className="flex-none hover:scale-105" isIconOnly>
                        <BiPlus className=" p-1 text-3xl" />
                    </Button>
                </div>

                {(currentItems.length != 0) &&
                    <button
                        type="button"
                        className=" text-sm text-start flex items-center px-5 text-[#858484] animate-fade-in origin-top"
                        onClick={() => { setCurrentItems([]); remove(); }}
                    >
                        <BiX className="text-lg" /> remove all
                    </button>
                }

                <div>
                    {currentItems && currentItems.map((item) => (
                        <>
                            <Chip
                                className="m-1 animate-fade-in"
                                key={'tagchip-' + item}
                                onClose={() => removeItem(item)}
                            >
                                {item}
                            </Chip>
                        </>
                    ))}
                </div>


            </div>

        </>
    )
}


export default ItemRelatedItemsForm;


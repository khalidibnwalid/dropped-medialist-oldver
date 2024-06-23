import { authContext } from "@/components/pagesComponents/authProvider";
import { itemData } from "@/types/item";
import { Autocomplete, AutocompleteItem, Card, Chip, Image } from "@nextui-org/react";
import type { Key } from "react";
import { KeyboardEvent, useContext, useEffect, useRef, useState } from "react";
import { useFieldArray } from 'react-hook-form';
import { BiX } from "react-icons/bi";
import { ItemFormContext } from "../provider";

function ItemRelatedItemsForm({ dataSet }: { dataSet: itemData[] }) {
    const { userData } = useContext(authContext)
    const { control, itemData } = useContext(ItemFormContext)
    const { append, remove } = useFieldArray({
        control,
        name: "related"
    });

    const [autoCompleteValue, setAutoCompleteValue] = useState(""); //autocomplete's current value
    const [currentDisplayedItems, setCurrentDisplayedItems] = useState<string[]>([]);
    const autocompleteRef = useRef<HTMLInputElement>(null)

    function name_to_id(name: Key | string) {
        const item = dataSet?.find((data) => (data.title == name));
        return item?.id || null;
    }

    function id_to_name(id: Key | string) {
        const item = dataSet?.find((data) => (data.id == id));
        return item?.title || null;
    }

    useEffect(() => {
        // itemData && setValue("related", itemData.related)
        if (itemData?.related && itemData.related?.length > 0) {
            const originalRelatedItems = itemData.related.map((id) => {
                const name = id_to_name(id)
                return name || ''
            }).filter(Boolean)
            setCurrentDisplayedItems(originalRelatedItems)
        }
    }, []);

    function addItem(key?: Key) {
        let currentValue = String(key || autoCompleteValue)
        //to ignore if you want to re-add the same item
        if (currentDisplayedItems.some((value) => (value === currentValue))) {
            return autocompleteRef.current?.blur()
        } else if (dataSet.some(data => (data.title === currentValue))) {
            // if the item exists
            const id = name_to_id(currentValue) || ""
            if (!id) return
            append({ value: id })
            setCurrentDisplayedItems(oldArray => [...oldArray, currentValue])
            setAutoCompleteValue("")
            autocompleteRef.current?.blur()
        }
    }

    function removeItem(item: string) {
        const newDisplayedItems = currentDisplayedItems.filter((value) => value !== item)
        setCurrentDisplayedItems(newDisplayedItems)
        const index = currentDisplayedItems.indexOf(item)
        remove(index)
        // 'id' in useFieldsArray and 'item' in currentItems both have the same index,
        // so getting one of the is enaugh to delete the other.
    }

    function onKeyEvent(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') addItem()
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
                        size="lg"
                        variant="bordered"
                        scrollShadowProps={{
                            isEnabled: false
                        }}
                        isClearable={false}
                        onKeyDown={onKeyEvent}
                        defaultItems={dataSet}
                        selectedKey={autoCompleteValue}
                    >
                        {item =>
                            <AutocompleteItem
                                onClick={() => addItem(item.title)}
                                key={item.id}
                                startContent={item.poster_path
                                    ? <Image
                                        className="flex-shrink-0 h-10 w-10 aspect-1 object-cover"
                                        alt={item.title}
                                        src={`${process.env.PUBLIC_IMG_PATH}/images/${userData.id}/${item.list_id}/${item.id}/thumbnails/${item.poster_path}_size=700xH.webp`}
                                    />
                                    : <Card
                                        className="uppercase font-light text-xl aspect-1 h-1 items-center justify-center bg-[#2f2f2f]"
                                        radius="lg"
                                    >
                                        {item.title[0]}
                                    </Card>
                                }
                            >
                                {item.title}
                            </AutocompleteItem>
                        }
                    </Autocomplete>
                </div>

                {(currentDisplayedItems.length !== 0) &&
                    <button
                        type="button"
                        className=" text-sm text-start flex items-center px-5 text-[#858484] animate-fade-in origin-top"
                        onClick={() => { setCurrentDisplayedItems([]); remove(); }}
                    >
                        <BiX className="text-lg" /> remove all
                    </button>
                }

                <div>
                    {currentDisplayedItems?.map((item) => (
                        <Chip
                            className="m-1 animate-fade-in"
                            key={'tagchip-' + item}
                            onClose={() => removeItem(item)}
                        >
                            {item}
                        </Chip>
                    ))}
                </div>

            </div>

        </>
    )
}

export default ItemRelatedItemsForm;


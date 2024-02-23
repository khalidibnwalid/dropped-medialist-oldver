'use client'

import type { main_fields } from "@/types/item"
import patchAPI from "@/utils/api/patchAPI"
import { Button, ButtonGroup } from "@nextui-org/react"
import { useContext, useState } from "react"
import { BiMinus, BiPlus } from "react-icons/bi"
import { itemViewContext } from "../item-layouts"

function ItemUpperFields() {
    const { itemData } = useContext(itemViewContext)

    return itemData.main_fields && (
        <div>
            {itemData.main_fields.map((data, index) => (
                data.bIsNumber ?
                    <ProgressButtons
                        key={data.name}
                        name={data.name}
                        value={data.value}
                        itemId={itemData.id}
                        index={index}
                    />
                    :
                    <p className=" font-semibold flex-grow py-1" key={data.name} >
                        {data.name}:  <b>{data.value}</b>
                    </p>
            ))}
        </div>
    )

}

export default ItemUpperFields


function ProgressButtons({ name, value, itemId, index = 0 }: main_fields) {
    index++ //PosgreSQL's index 0 for jsonb gives null.
    const [Value, setValue] = useState(parseInt(value))

    async function increValue() {
        if (Value > 0) {
            setValue(i => i + 1)
            patchAPI(`items/fields/${itemId}`, { "index": index, "value": Value + 1 })
            //  await petchItem(itemId, {})
        }
    }
    async function decreValue() {
        if (Value > 0) {
            setValue(i => i - 1)
            patchAPI(`items/fields/${itemId}`, { "index": index, "value": Value - 1 })
        }
    }

    return (
        <div className="flex py-1 items-center">
            <p className=" flex-grow"> <b> {name}: </b> {Value} </p>
            {/* should be turned into a component that has a useState hook*/}
            <ButtonGroup className="flex-none">
                <Button size="sm" isIconOnly onPress={decreValue}><BiMinus /></Button>
                <Button size="sm" isIconOnly onPress={increValue}><BiPlus /></Button>
            </ButtonGroup>
        </div>
    )

}


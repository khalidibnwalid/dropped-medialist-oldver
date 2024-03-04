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
                        fields={itemData.main_fields || []}
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


function ProgressButtons({ name, value, itemId, index, fields }: main_fields & { fields: main_fields[], index: number }) {
    // we add the new updated value to main_fields then patch it

    const [Value, setValue] = useState(parseInt(value as string))

    async function increValue() {
        if (Value <= 0) return
        setValue(i => i + 1)
        fields[index].value = Value + 1
        patchAPI(`items/${itemId}`, { main_fields: fields })

    }
    async function decreValue() {
        if (Value <= 0) return
        setValue(i => i - 1)
        fields[index].value = Value - 1
        patchAPI(`items/${itemId}`, { main_fields: fields })
    }

    return (
        <div className="flex py-1 items-center">
            <p className=" flex-grow"> <b> {name}: </b> {Value} </p>
            <ButtonGroup className="flex-none">
                <Button size="sm" isIconOnly onPress={decreValue}><BiMinus /></Button>
                <Button size="sm" isIconOnly onPress={increValue}><BiPlus /></Button>
            </ButtonGroup>
        </div>
    )

}


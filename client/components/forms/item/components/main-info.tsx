'use client'

import { Input, Textarea } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { ItemFormContext } from "../provider";

function ItemMainInfoForm() {
    const { control, itemData } = useContext(ItemFormContext)

    return (
        <>
            <Controller
                defaultValue={itemData?.title}
                control={control}
                name="title"
                rules={{ required: true }}
                render={({ field }) =>
                    <Input
                        isRequired
                        className="shadow-sm rounded-xl"
                        type="text"
                        label="Title"
                        {...field}
                    />
                } />

            <Controller
                defaultValue={itemData?.description}
                control={control}
                name="description"
                render={({ field }) =>
                    <Textarea
                        label="Description"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Enter your description"
                        className=" my-3"
                        maxRows={30}
                        {...field} />
                } />

        </>
    )
}


export default ItemMainInfoForm;


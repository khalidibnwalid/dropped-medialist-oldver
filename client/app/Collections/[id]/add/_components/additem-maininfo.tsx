'use client'

import { Input, Textarea } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { AddItemPageContext } from "../page";

function AddMainInfo() {
    const { control } = useContext(AddItemPageContext)

    return (
        <>
            <Controller
                control={control}
                name="title"
                rules={{ required: true }}
                render={({ field }) =>
                    <Input
                        isRequired 
                        className="shadow-sm rounded-xl"
                        type="text"
                        label="Title"
                        {...field} />
                } />

            <Controller
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

export default AddMainInfo
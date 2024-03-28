'use client'

import { Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { ItemApiTemplateContext } from "../provider";

function ItemApiMainInfo() {
    const { control, errors, currentApiTemplate } = useContext(ItemApiTemplateContext)

    return (
        <>
            <Controller
                control={control}
                name="name"
                rules={{ required: true }}
                render={({ field }) =>
                    <Input
                        isRequired
                        className="shadow-sm rounded-xl"
                        type="text"
                        label="API Template's Name"
                        {...field}
                    />
                } />
            <Controller
                control={control}
                name="baseURL"
                rules={{
                    required: true,
                    pattern: {
                        value: /^(http|https):\/\/[^ "]+$/i,
                        message: 'Please enter a valid URL',
                    }
                }}
                render={({ field }) =>
                    <Input
                        isInvalid={errors.baseURL && true}
                        color={errors.baseURL && "danger"}
                        errorMessage={errors?.baseURL?.message}
                        isRequired
                        className="shadow-sm rounded-xl"
                        type="text"
                        label="Base URL"
                        {...field}
                    />
                } />

        </>
    )
}

export default ItemApiMainInfo
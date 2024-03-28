'use client'

import { Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { ItemApiTemplateContext } from "../../provider";

function ItemApiSearchMainInfo() {
    const { control, errors, pattern, searchIsAllowed } = useContext(ItemApiTemplateContext)

    return (
        <>
            <Controller
                disabled={!searchIsAllowed}
                control={control}
                name="searchArrayPath"
                rules={{ required: true, pattern }}
                render={({ field }) =>
                    <Input
                        isDisabled={!searchIsAllowed}
                        isInvalid={errors.baseURL && true}
                        color={errors.baseURL && "danger"}
                        errorMessage={errors?.baseURL?.message}
                        isRequired
                        className="shadow-sm rounded-xl"
                        type="text"
                        label="Search Array's Path"
                        {...field}
                    />
                } />
            <Controller
                disabled={!searchIsAllowed}
                control={control}
                name="searchTitlePath"
                rules={{ required: true, pattern }}
                render={({ field }) =>
                    <Input
                        isDisabled={!searchIsAllowed}
                        isInvalid={errors.baseURL && true}
                        color={errors.baseURL && "danger"}
                        errorMessage={errors?.baseURL?.message}
                        isRequired
                        className="shadow-sm rounded-xl"
                        type="text"
                        label="Search Result's Title's Path"
                        {...field}
                    />
                } />

            <div className="grid grid-cols-2 gap-x-3">
                <Controller
                    disabled={!searchIsAllowed}
                    control={control}
                    name="searchResultToItem.path"
                    rules={{ required: true, pattern }}
                    render={({ field }) =>
                        <Input
                            isDisabled={!searchIsAllowed}
                            isInvalid={errors.baseURL && true}
                            color={errors.baseURL && "danger"}
                            errorMessage={errors?.baseURL?.message}
                            isRequired
                            className="shadow-sm rounded-xl"
                            type="text"
                            label="Needed Value's Path for Search"
                            {...field}
                        />
                    } />
                <Controller
                    disabled={!searchIsAllowed}
                    control={control}
                    name="searchResultToItem.query"
                    rules={{ pattern }}
                    render={({ field }) =>
                        <Input
                            isDisabled={!searchIsAllowed}
                            isInvalid={errors.baseURL && true}
                            color={errors.baseURL && "danger"}
                            errorMessage={errors?.baseURL?.message}
                            className="shadow-sm rounded-xl"
                            type="text"
                            label="Needed Query for Search"
                            {...field}
                        />
                    } />
            </div>

        </>
    )
}

export default ItemApiSearchMainInfo
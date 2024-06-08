'use client'

import { Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { ItemApiTemplateContext } from "../provider";

function ItemApiSearchMainInfo() {
    const { control, errors, pattern, searchIsDisabled, queryPattern } = useContext(ItemApiTemplateContext)

    return (
        <>
            <Controller
                disabled={searchIsDisabled}
                control={control}
                name="searchArrayPath"
                rules={{ required: true, pattern }}
                render={({ field }) =>
                    <Input
                        isDisabled={searchIsDisabled}
                        isInvalid={errors.searchArrayPath && true}
                        color={errors.searchArrayPath && "danger"}
                        errorMessage={errors?.searchArrayPath?.message}
                        isRequired
                        className="shadow-sm rounded-xl"
                        type="text"
                        label="Search Array's Path"
                        {...field}
                    />
                } />
            <Controller
                disabled={searchIsDisabled}
                control={control}
                name="searchTitlePath"
                rules={{ required: true, pattern }}
                render={({ field }) =>
                    <Input
                        isDisabled={searchIsDisabled}
                        isInvalid={errors.searchTitlePath && true}
                        color={errors.searchTitlePath && "danger"}
                        errorMessage={errors?.searchTitlePath?.message}
                        isRequired
                        className="shadow-sm rounded-xl"
                        type="text"
                        label="Search Result's Title's Path"
                        {...field}
                    />
                } />

            <div className="grid grid-cols-2 gap-x-3">
                <Controller
                    disabled={searchIsDisabled}
                    control={control}
                    name="searchResultToItem.path"
                    rules={{ required: true, pattern }}
                    render={({ field }) =>
                        <Input
                            isDisabled={searchIsDisabled}
                            isInvalid={errors?.searchResultToItem?.path && true}
                            color={errors?.searchResultToItem?.path && "danger"}
                            errorMessage={errors?.searchResultToItem?.path?.message}
                            isRequired
                            className="shadow-sm rounded-xl"
                            type="text"
                            label="Needed Value's Path for Search"
                            {...field}
                        />
                    } />
                <Controller
                    disabled={searchIsDisabled}
                    control={control}
                    name="searchResultToItem.query"
                    rules={{ pattern: queryPattern }}
                    render={({ field }) =>
                        <Input
                            isDisabled={searchIsDisabled}
                            isInvalid={errors?.searchResultToItem?.query && true}
                            color={errors?.searchResultToItem?.query && "danger"}
                            errorMessage={errors?.searchResultToItem?.query?.message}
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
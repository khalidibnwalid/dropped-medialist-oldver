'use client'

import { listApiWithSearchType } from "@/types/list";
import { queryFromObject } from "@/utils/helper-functions/queryFromObject";
import { Button, Input, Spinner } from "@nextui-org/react";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ItemApiLoaderContext } from "./provider";

export const ItemSearchAPILoaders = ({
    setPageNumber,
    selectedRoutes
}: {
    setPageNumber: Dispatch<SetStateAction<number>>,
    selectedRoutes: string[]
}) => {
    const { usedAPITemplate, searchApi } = useContext(ItemApiLoaderContext);
    const { register, handleSubmit } = useForm()
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(data: object) {
        setIsLoading(true)

        let route = selectedRoutes.join('')
        let query = queryFromObject(data)
        const finalRouteAndQuery = route + (usedAPITemplate?.baseURL.endsWith('&') ? '' : '?') + query

        await searchApi(usedAPITemplate as listApiWithSearchType, finalRouteAndQuery)

        setPageNumber(1)
        setIsLoading(false)
    }

    return !isLoading ? (
        <form className="space-y-2 animate-fade-in">
            <div className="flex items-center">
                <p className="text-zinc-500 text-lg flex-grow">Search: </p>
                <Button
                    type="button"
                    color="primary"
                    size="sm"
                    className=" shadow-lg flex-none"
                    onClick={handleSubmit(onSubmit)}
                >
                    Search
                </Button>
            </div>

            {(usedAPITemplate as listApiWithSearchType).searchQueries?.map(data =>
                <div
                    key={'apiQueryInput' + data.name}
                    className="flex items-center gap-x-2 "
                >
                    <p className="flex-none">Search by {data.name} :</p>
                    <Input
                        aria-label={'api Query Input ' + data.name}
                        labelPlacement="outside"
                        className="flex-grow"
                        variant="bordered"
                        size="sm"
                        {...register(data.query)}
                    />
                </div>)
            }
        </form>
    ) : <Spinner label="Searching..." />
}
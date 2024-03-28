'use client'

import { listApiWithSearchType } from "@/types/list";
import { queryFromObject } from "@/utils/helper-functions/queryFromObject";
import { Button, Input, Listbox, ListboxItem, Spinner } from "@nextui-org/react";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ItemApiLoaderContext } from "./provider";

export const ItemSearchAPILoaders = ({ setPageNumber }: { setPageNumber: Dispatch<SetStateAction<number>> }) => {
    const { usedAPITemplate, searchApi } = useContext(ItemApiLoaderContext);
    const { register, handleSubmit } = useForm()

    const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(data: object) {
        setIsLoading(true)

        let route = ''
        selectedRoutes.forEach(currentRoute => route += '/' + currentRoute)
        let query = decodeURIComponent(queryFromObject(data))
        const finalRouteAndQuery = route + (selectedRoutes.length !== 0 && query ? '?' : '') + query
        //it should turn it into query since it take spaces as white spaces which url doesn't accept 
        //to understand try search for a word with a whitespace such as 'to the'
        // also make an input for 'after Route' or just let it for an empty query
        // make routes unifed

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
            {(usedAPITemplate as listApiWithSearchType)?.searchRoutes?.length !== 0 && (
                <>
                    <Listbox
                        aria-label="routes"
                        selectionMode="multiple"
                        hideEmptyContent
                        items={(usedAPITemplate as listApiWithSearchType).searchRoutes}
                        selectedKeys={selectedRoutes}
                        onSelectionChange={(e: any) => setSelectedRoutes(e)}
                    >
                        {(data =>
                            <ListboxItem key={data.route} textValue={'/' + data.name}>/{data.name}</ListboxItem>
                        )}
                    </Listbox>
                </>
            )}

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
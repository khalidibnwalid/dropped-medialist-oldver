'use client'

import { listApiType } from "@/types/list";
import { queryFromObject } from "@/utils/helper-functions/queryFromObject";
import { Button, Input } from "@nextui-org/react";
import { Dispatch, SetStateAction, useContext } from "react";
import { useForm } from "react-hook-form";
import { ItemApiLoaderContext } from "./provider";

export const ItemDirectAPILoaders = ({
    onClose,
    setIsLoading,
    selectedRoutes,
    setError
}: {
    onClose: () => void,
    setIsLoading: Dispatch<SetStateAction<boolean>>
    selectedRoutes: string[],
    setError: Dispatch<SetStateAction<string | null>>
}) => {
    const { loadAPITemplate, usedAPITemplate } = useContext(ItemApiLoaderContext);
    const { register, handleSubmit } = useForm()

    async function onSubmit(data: { emptyQuery?: string[] }) {
        setIsLoading(true)
        const { emptyQuery, ...restData } = data

        let route = selectedRoutes.join('')
        let query = queryFromObject(restData)

        // baseURL if it ends with '&' then it is already preparing for a query 
        const finalRouteAndQuery = route
            + (query ? (usedAPITemplate?.baseURL.endsWith('&') ? '' : '?') + query : '')
            + (emptyQuery ? '/' + decodeURIComponent(emptyQuery.join('')) : '');

        try {
            await loadAPITemplate(usedAPITemplate as listApiType, finalRouteAndQuery)

            setIsLoading(false)
            onClose()
        } catch (e) {
            setIsLoading(false)
            setError('Bad API Request')}
    }

    let emptyQueryIndex = 0

    return (
        <form className="space-y-2 animate-fade-in">
            <div className="flex items-center">
                <p className="text-zinc-500 text-lg flex-grow">Direct: </p>
                <Button
                    color="primary"
                    size="sm"
                    className="shadow-lg float-end flex-none"
                    onClick={handleSubmit(onSubmit)}
                >
                    Load Item With API
                </Button>
            </div>
            {usedAPITemplate?.routes?.map((template, index) =>
                <div
                    key={'apiQueryInput' + template.name}
                    className="flex items-center gap-x-2 "
                >
                    <p className="flex-none">  {template.name} :</p>
                    <Input
                        aria-label={'api Query Input ' + template.name}
                        labelPlacement="outside"
                        className="flex-grow"
                        variant="bordered"
                        size="sm"
                        {...register(template.route)}
                    />
                </div>
            )}

            {usedAPITemplate?.queries?.map((template) =>
                <div
                    key={'apiQueryInput' + template.name}
                    className="flex items-center gap-x-2 "
                >
                    <p className="flex-none"> by {template.name} :</p>
                    <Input
                        aria-label={'api Query Input ' + template.name}
                        labelPlacement="outside"
                        className="flex-grow"
                        variant="bordered"
                        size="sm"
                        {...register(template.query || `emptyQuery[${emptyQueryIndex++}]`)}
                    />
                </div>
            )}

        </form>
    )
}

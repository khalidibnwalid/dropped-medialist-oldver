import TitleBar from '@/components/bars/titlebar';
import ErrorPage from '@/components/errorPage';
import SubmitButtonWithIndicators from '@/components/forms/_components/SubmitWithIndicators';
import ApiFormLayout from '@/components/forms/api/general-layout';
import { ItemApiTemplateContext } from '@/components/forms/api/provider';
import ListsLoading from '@/components/pagesComponents/lists/listsLoading';
import type { listApiType, listApiWithSearchType, listData } from '@/types/list';
import patchAPI from '@/utils/api/patchAPI';
import sanitizeObject from '@/utils/helperFunctions/sanitizeObject';
import { listFetchOptions, mutateListCache } from "@/utils/query/listsQueries";
import { Button } from "@nextui-org/react";
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiCheckDouble, BiInfoCircle, BiPlus } from 'react-icons/bi';
import { validate as uuidValidate } from 'uuid';

function AddAPIPage() {
    const router = useRouter();
    const listId = router.query.id as string

    const { handleSubmit, control, setValue, getValues, formState: { errors }, resetField } = useForm<listApiWithSearchType>();
    const { data: listData, isPending, isError } = useQuery(listFetchOptions(listId))

    const mutation = useMutation({
        mutationFn: (data: Partial<listData>) => patchAPI(`lists/${listId}`, data),
        onSuccess: (data) => mutateListCache(data, "edit"),
    })

    const [searchIsDisabled, setSearchIsDisabled] = useState<true | undefined>(undefined)

    if (isPending) return <ListsLoading />
    if (isError) return <ErrorPage message="Failed to Fetch List Data" />

    /** Input Pattern bassed on apiDataValuesPicker() function of load_api provider */
    const pathRegex = /("([^"]*)"|'([^']*)')|[\w\d::>>]+/g

    const pattern = {
        value: pathRegex,
        message: 'Please enter a valid Path',
    }

    /** Query Pattern */
    const queryRegex = /^&*(\w+=\w+&)*\w+=$/
    const queryPattern = {
        value: queryRegex,
        message: 'query must be in the form of key= or key=value&key=...'
    }

    const fieldTemplates = listData.templates?.fieldTemplates

    async function onSubmit(rawData: listApiWithSearchType) {
        // console.log("rawData", rawData) //devmode
        if (!listData) return

        let templates = { ...listData.templates }
        // if apiTemplates doesn't exist, create it
        !templates.apiTemplates && (templates['apiTemplates'] = [])

        let apiTemplate = {} as listApiWithSearchType

        const {
            searchQueries,
            searchResultToItem,
            searchTitlePath,
            searchArrayPath,
            ...restData
        }: listApiWithSearchType = rawData

        if (!searchIsDisabled) {
            apiTemplate['searchQueries'] = searchQueries;
            apiTemplate['searchResultToItem'] = searchResultToItem;
            apiTemplate['searchTitlePath'] = searchTitlePath;
            apiTemplate['searchArrayPath'] = searchArrayPath;
        }
        // if search isn't allowed their values will be ignored

        apiTemplate = { ...apiTemplate, ...restData };

        sanitizeObject(apiTemplate)
        templates.apiTemplates.push(apiTemplate as listApiType)

        mutation.mutate({ templates })
    }

    return (
        <>
            <Head>
                <title>MediaList - {listData.title} Add API Template</title>
            </Head>

            <ItemApiTemplateContext.Provider value={{
                listData,
                searchIsDisabled,
                setSearchIsDisabled,
                control,
                fieldTemplates,
                setValue,
                getValues,
                errors,
                pathRegex,
                pattern,
                queryPattern

            }}>
                <form>
                    <TitleBar
                        pointedBg
                        title="Add an API Template"
                        startContent={<BiPlus className="text-[30px] mr-3 flex-none" />}
                        withButtons
                    >
                        <Button
                            className="focus:outline-none"
                            variant="solid"
                            onClick={() => window.open('', "_blank")}
                        >
                            {/* //devmode //put wiki's link */}
                            <BiInfoCircle className="text-xl" /> Guide
                        </Button>

                        <SubmitButtonWithIndicators
                            mutation={mutation}
                            onClick={handleSubmit(onSubmit)}
                            saveOnClick={() => router.push(`/lists/${listId}/add`)}
                            savedContent={<><BiCheckDouble className="text-xl" /> Saved, Go Add Items</>}
                        />
                    </TitleBar>

                    <ApiFormLayout />

                </form>

            </ItemApiTemplateContext.Provider>
        </>
    )
}

export default function AddAPIPageHOC() {
    const router = useRouter();
    const itemId = router.query.id as string
    return uuidValidate(itemId) ? <AddAPIPage /> : <ErrorPage message="Bad List ID, Page Doesn't Exist" MainMessage="404!" />
}
import TitleBar from '@/components/bars/titlebar';
import { TrashPopover } from '@/components/buttons/trashpop-button';
import ErrorPage from '@/components/errorPage';
import SubmitButtonWithIndicators from '@/components/forms/_components/SubmitWithIndicators';
import ApiFormLayout from '@/components/forms/api/general-layout';
import { ItemApiTemplateContext } from '@/components/forms/api/provider';
import LoadingLists from '@/components/pagesComponents/lists/listsloading';
import type { listApiType, listApiWithSearchType, listData } from '@/types/list';
import patchAPI from '@/utils/api/patchAPI';
import sanitizeObject from '@/utils/helperFunctions/sanitizeObject';
import { listFetchOptions, mutateListCache } from "@/utils/query/listsQueries";
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiInfoCircle, BiPlus, BiTrash } from 'react-icons/bi';
import { TbApiApp } from 'react-icons/tb';
import { validate as uuidValidate } from 'uuid';

function EditAPIPage() {
    const router = useRouter()
    const listId = router.query.id as string

    const { handleSubmit, control, setValue, getValues, formState: { errors } } = useForm<listApiWithSearchType>();
    const { data: listData, isPending, isError, isSuccess } = useQuery(listFetchOptions(listId))

    const mutation = useMutation({
        mutationFn: (data: Partial<listData>) => patchAPI(`lists/${listId}`, data),
        onSuccess: (data) => mutateListCache(data, "edit"),
    })

    /** Load it as Current API template */
    function loadApiTemplate(apiTemplate: listApiType, reset = true) {
        setCurrentApiTemplate(apiTemplate);
        setSelectedAutocompleteKey(apiTemplate.name)
        if ((apiTemplate as listApiWithSearchType).searchTitlePath) setSearchIsAllowed(true)
        for (let key in apiTemplate) {
            setValue((key as keyof listApiType), apiTemplate[key as keyof listApiType])
        }
        reset && mutation.reset()
    }

    useEffect(() => {
        if (isSuccess && listData) {
            if (listData.templates?.apiTemplates && listData.templates?.apiTemplates?.length > 0) {
                loadApiTemplate(listData.templates?.apiTemplates[0])
            } else {
                router.push(`/lists/${listData.id}/api/add`); // if no apitemplate exist redirect to add api page
            }
        }
    }, [isSuccess])

    const [searchIsAllowed, setSearchIsAllowed] = useState(false)
    const [currentApiTemplate, setCurrentApiTemplate] = useState<listApiType>({} as listApiType)
    const [SelectedAutocompleteKey, setSelectedAutocompleteKey] = useState('')

    if (isPending) return <LoadingLists />
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

    const fieldTemplates = listData.templates?.fieldTemplates;

    function deleteApiTemplate() {
        if (!listData?.templates?.apiTemplates) return
        const filtredApiTemplates = listData.templates?.apiTemplates?.filter((template) => template.name !== currentApiTemplate.name)
        mutation.mutate({ templates: { ...listData.templates, apiTemplates: filtredApiTemplates } })
        filtredApiTemplates?.length === 0 ? router.push(`/lists/${listData.id}`) : loadApiTemplate(filtredApiTemplates[0])
    }

    function onSubmit(rawData: listApiWithSearchType) {
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

        if (searchIsAllowed) {
            apiTemplate['searchQueries'] = searchQueries;
            apiTemplate['searchResultToItem'] = searchResultToItem;
            apiTemplate['searchTitlePath'] = searchTitlePath;
            apiTemplate['searchArrayPath'] = searchArrayPath;
        }
        // if search isn't allowed their values will be ignored

        apiTemplate = { ...apiTemplate, ...restData };

        sanitizeObject(apiTemplate)
        const currentApiTemplateIndex = templates.apiTemplates.findIndex((template) => template.name === currentApiTemplate.name)
        templates.apiTemplates[currentApiTemplateIndex] = apiTemplate

        mutation.mutate({ templates })

        if (currentApiTemplate.name !== apiTemplate.name) {
            loadApiTemplate(apiTemplate, false)
        }
    }

    return (
        <>
            <Head>
                <title>MediaList - {listData.title} Edit API Templates</title>
            </Head>

            <ItemApiTemplateContext.Provider value={{ listData, searchIsAllowed, setSearchIsAllowed, control, fieldTemplates, setValue, getValues, errors, pathRegex, pattern, currentApiTemplate, queryPattern }}>
                <form key={currentApiTemplate.name}>
                    <TitleBar
                        starShowerBlack
                        title=""
                        startContent={
                            <div className='flex gap-x-2 items-center'>
                                <TbApiApp className="text-5xl" />
                                <Autocomplete
                                    isClearable={false}
                                    variant='bordered'
                                    size='sm'
                                    label="Select an Api Template"
                                    className="max-w-xs flex-grow"
                                    selectedKey={SelectedAutocompleteKey}
                                    onSelectionChange={(e: any) => setSelectedAutocompleteKey(e)}
                                    defaultItems={listData.templates?.apiTemplates}
                                >
                                    {(template) => (
                                        <AutocompleteItem onClick={() => loadApiTemplate(template)} key={template.name} value={template.name}>
                                            {template.name}
                                        </AutocompleteItem>
                                    )}
                                </Autocomplete>

                                <TrashPopover
                                    onPress={deleteApiTemplate}
                                    placement='bottom'
                                >
                                    {({ isTrashOpen }) => (
                                        <Button
                                            variant='bordered'
                                            size='lg'
                                            isIconOnly
                                            className={isTrashOpen ? 'bg-danger' : ''}
                                        >
                                            <BiTrash className=" text-xl" />
                                        </Button>
                                    )}
                                </TrashPopover>

                                <Button
                                    variant='bordered'
                                    size='lg'
                                    onClick={() => router.push(`/lists/${listData.id}/api/add`)}
                                    isIconOnly
                                >
                                    <BiPlus className=" text-3xl" />
                                </Button>

                            </div>
                        }
                        withButtons
                    >

                        <Button
                            className="focus:outline-none"
                            variant="solid"
                            onClick={() => router.push('www.google.com')}
                        >
                            {/* //devmode //put wiki's link */}
                            <BiInfoCircle className="text-xl" /> Guide
                        </Button>

                        <SubmitButtonWithIndicators
                            mutation={mutation}
                            onClick={handleSubmit(onSubmit)}
                            saveOnClick={handleSubmit(onSubmit)}
                        />

                    </TitleBar>

                    <ApiFormLayout />

                </form >

            </ItemApiTemplateContext.Provider >
        </>
    )
}

export default function EditAPIPageHOC() {
    const router = useRouter();
    const itemId = router.query.id as string
    return uuidValidate(itemId) ? <EditAPIPage /> : <ErrorPage message="Bad List ID, Page Doesn't Exist" MainMessage="404!" />
}
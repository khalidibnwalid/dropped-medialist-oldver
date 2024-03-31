'use client'

import TitleBar from '@/components/bars/titlebar';
import { TrashPopover } from '@/components/buttons/trashpop-button';
import type { listApiType, listApiWithSearchType, listData } from '@/types/list';
import fetchAPI from '@/utils/api/fetchAPI';
import patchAPI from '@/utils/api/patchAPI';
import sanitizeObject from '@/utils/helper-functions/sanitizeObject';
import { Autocomplete, AutocompleteItem, Button, Spinner } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiCheckDouble, BiInfoCircle, BiPlus, BiTrash } from 'react-icons/bi';
import { FaSave } from 'react-icons/fa';
import { TbApiApp } from 'react-icons/tb';
import LoadingLists from '../../loading';
import ApiFormLayout from './_components/general-layout';
import { ItemApiTemplateContext } from './provider';

export default function APIPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [listData, setListData] = useState<listData>({} as listData);
    const [searchIsAllowed, setSearchIsAllowed] = useState(false)
    const [currentApiTemplate, setCurrentApiTemplate] = useState<listApiType>({} as listApiType)
    const [SelectedAutocompleteKey, setSelectedAutocompleteKey] = useState('')
    const [isSaved, setIsSaved] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const { handleSubmit, control, setValue, getValues, formState: { errors }, resetField } = useForm<listApiWithSearchType>();

    /** Input Pattern bassed on apiDataValuesPicker() function of load_api provider */
    const pathRegex = /("([^"]*)"|'([^']*)')|[\w\d::>>]+/g

    const pattern = {
        value: pathRegex,
        message: 'Please enter a valid Path',
    }

    /** Query Pattern */
    const queryRegex = /^(\w+=\w+&)*\w+=$/
    const queryPattern = {
        value: queryRegex,
        message: 'query must be in the form of key= or key=value&key=...'
    }

    /** Load it as Current API template */
    function loadApiTemplate(apiTemplate: listApiType) {
        setCurrentApiTemplate(apiTemplate);
        setSelectedAutocompleteKey(apiTemplate.name)
        if ((apiTemplate as listApiWithSearchType).searchTitlePath) setSearchIsAllowed(true)

        for (let key in apiTemplate) {
            setValue((key as keyof listApiType), apiTemplate[key as keyof listApiType])
        }
        isSaved === true && setIsSaved(false)
        isSaving === true && setIsSaving(false)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const listData = await fetchAPI(`lists/${params.id}`)
                if (listData.templates?.apiTemplates?.length > 0) {
                    setListData(listData);
                    loadApiTemplate(listData.templates?.apiTemplates[0])
                } else {
                    router.push(`/lists/${listData.id}/api/add`);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, []);

    const fieldTemplates = listData.templates?.fieldTemplates;

    async function deleteApiTemplate() {
        const filtredApiTemplates = listData.templates?.apiTemplates?.filter((template) => template.name !== currentApiTemplate.name)

        try {
            await patchAPI(`lists/${listData.id}`, {
                templates: { ...listData.templates, apiTemplates: filtredApiTemplates }
            })
            router.push(`/lists/${listData.id}/api`)
        } catch (e) {
            console.log("(API Template) Error:", "Failed to Delete API Template", e)
        }
    }

    async function onSubmit(rawData: listApiWithSearchType) {
        // console.log("rawData", rawData) //devmode

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

        try {
            // console.log("final data", { templates })//devmode
            setIsSaving(true)
            await patchAPI(`lists/${params.id}`, { templates })
            /** reFetch data instead of refreshing */
            const listData = await fetchAPI(`lists/${params.id}`)
            setListData(listData);
            setIsSaving(false)
            setIsSaved(true)
        } catch (e) {
            console.log("(API Template) Error:", "Failed to Add New API", e)
        }

    };

    // if no apitemplate exist redirect to add api page
    return listData.title ? (
        <>
            <ItemApiTemplateContext.Provider value={{ searchIsAllowed, setSearchIsAllowed, control, fieldTemplates, setValue, getValues, errors, pathRegex, pattern, currentApiTemplate, queryPattern }}>
                <form key={currentApiTemplate.name}>
                    <TitleBar
                        starShowerBlack
                        title=""
                        icon={
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
                                <Button
                                    variant='bordered'
                                    size='lg'
                                    onClick={() => router.push(`/lists/${params.id}/api/add`)}
                                    isIconOnly
                                >
                                    <BiPlus className=" text-3xl" />
                                </Button>

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
                        {isSaving ?
                            <Button className='bg-accented'>
                                <Spinner size='sm' />
                            </Button>
                            : <Button
                                className={"focus:outline-none" + isSaved ? '' : 'bg-accented'}
                                variant="solid"
                                color={isSaved ? 'success' : undefined}
                                onClick={handleSubmit(onSubmit)}
                            >
                                {isSaved
                                    ? <BiCheckDouble className="text-xl" />
                                    : <FaSave className="text-xl" />
                                }

                                {isSaved ? 'Saved' : 'Save'}
                            </Button>}

                    </TitleBar>

                    <ApiFormLayout />

                </form >

            </ItemApiTemplateContext.Provider >
        </>
    ) : (<LoadingLists />)
}
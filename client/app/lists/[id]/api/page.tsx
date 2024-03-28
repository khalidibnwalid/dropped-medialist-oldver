'use client'

import TitleBar from '@/components/bars/titlebar';
import type { listApiType, listApiWithSearchType, listData } from '@/types/list';
import fetchAPI from '@/utils/api/fetchAPI';
import patchAPI from '@/utils/api/patchAPI';
import sanitizeObject from '@/utils/helper-functions/sanitizeObject';
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiInfoCircle, BiPlus } from 'react-icons/bi';
import { FaSave } from 'react-icons/fa';
import LoadingLists from '../../loading';
import ApiFormLayout from './_components/general-layout';
import { ItemApiTemplateContext } from './provider';


export default function APIPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [listData, setListData] = useState<listData>({} as listData);
    const [searchIsAllowed, setSearchIsAllowed] = useState(false)
    const [currentApiTemplate, setCurrentApiTemplate] = useState<listApiType>({} as listApiType)
    const [SelectedAutocompleteKey, setSelectedAutocompleteKey] = useState('')

    const { handleSubmit, control, setValue, getValues, formState: { errors }, resetField } = useForm<listApiWithSearchType>();

    const pathRegex = /("([^"]*)"|'([^']*)')|[\w\d::>>]+/g

    /** React Hook Form's Input Pattern  */
    const pattern = {
        value: pathRegex,
        message: 'Please enter a valid Path',
    }

    function useApiTemplate(apiTemplate: listApiType) {
        setCurrentApiTemplate(apiTemplate);
        setSelectedAutocompleteKey(apiTemplate.name)
        if ((apiTemplate as listApiWithSearchType).searchTitlePath) setSearchIsAllowed(true)

        for (let key in apiTemplate) {
            setValue((key as keyof listApiType), apiTemplate[key as keyof listApiType])
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const listData = await fetchAPI(`lists/${params.id}`)
                if (listData.templates?.apiTemplates?.length > 0) {
                    setListData(listData);
                    useApiTemplate(listData.templates?.apiTemplates[0])
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
            await patchAPI(`lists/${params.id}`, { templates })
            router.refresh()
        } catch (e) {
            console.log("(Item) Error:", "Failed to Add New Item", e)
        }

    };

    // if no apitemplate exist redirect to add api page
    return listData.title ? (
        <>
            <ItemApiTemplateContext.Provider value={{ searchIsAllowed, setSearchIsAllowed, control, fieldTemplates, setValue, getValues, errors, pathRegex, pattern, currentApiTemplate }}>
                <form key={currentApiTemplate.name}>
                    <TitleBar
                        starShowerBlack
                        title=""
                        icon={
                            <Autocomplete
                                variant='bordered'
                                size='sm'
                                label="Select an Api Template"
                                className="max-w-xs"
                                selectedKey={SelectedAutocompleteKey}
                                onSelectionChange={(e: any) => setSelectedAutocompleteKey(e)}
                                defaultItems={listData.templates?.apiTemplates}
                            >
                                {(template) => (
                                    <AutocompleteItem onClick={() => useApiTemplate(template)} key={template.name} value={template.name}>
                                        {template.name}
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>
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
                        <Button
                            className="focus:outline-none bg-accented"
                            variant="solid"
                            onClick={handleSubmit(onSubmit)}
                        >
                            <FaSave className="text-xl" /> Save
                        </Button>
                        <Button
                            className="focus:outline-none bg-accented"
                            variant="solid"
                            onClick={() => router.push(`/lists/${params.id}/api/add`)}
                        >
                            <BiPlus className="text-xl" /> Add New
                        </Button>
                    </TitleBar>

                    <ApiFormLayout />

                </form>

            </ItemApiTemplateContext.Provider>
        </>
    ) : (<LoadingLists />)
}
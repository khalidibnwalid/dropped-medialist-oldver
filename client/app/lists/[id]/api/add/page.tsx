'use client'

import LoadingLists from '@/app/lists/loading';
import TitleBar from '@/components/bars/titlebar';
import type { listApiType, listApiWithSearchType, listData } from '@/types/list';
import fetchAPI from '@/utils/api/fetchAPI';
import patchAPI from '@/utils/api/patchAPI';
import sanitizeObject from '@/utils/helper-functions/sanitizeObject';
import { Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiInfoCircle, BiPlus } from 'react-icons/bi';
import ApiFormLayout from '../_components/general-layout';
import { ItemApiTemplateContext } from '../provider';

export default function AddAPIPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [listData, setListData] = useState<listData>({} as listData);
    const [searchIsAllowed, setSearchIsAllowed] = useState(false)

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const listData = await fetchAPI(`lists/${params.id}`)
                setListData(listData);

            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, []);

    const fieldTemplates = listData.templates?.fieldTemplates

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
        templates.apiTemplates.push(apiTemplate as listApiType)


        try {
            // console.log("final data", { templates })//devmode
            await patchAPI(`lists/${params.id}`, { templates })
            router.push(`/lists/${params.id}`)
        } catch (e) {
            console.log("(API Template) Error:", "Failed to Add New API", e)
        }

    };


    return listData.title ? (
        <>
            <ItemApiTemplateContext.Provider value={{ searchIsAllowed, setSearchIsAllowed, control, fieldTemplates, setValue, getValues, errors, pathRegex, pattern, queryPattern }}>

                <form>

                    <TitleBar starShowerBlack
                        title="Add an API Template"
                        icon={
                            <BiPlus className="text-[30px] mr-3 flex-none" />
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
                            <BiPlus className="text-xl" /> Save Api Template
                        </Button>
                    </TitleBar>

                    <ApiFormLayout />

                </form>

            </ItemApiTemplateContext.Provider>
        </>
    ) : (<LoadingLists />)
}
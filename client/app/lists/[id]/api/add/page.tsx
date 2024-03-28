'use client'

import TitleBar from '@/components/bars/titlebar';
import type { listApiType, listData } from '@/types/list';
import fetchAPI from '@/utils/api/fetchAPI';
import sanitizeObject from '@/utils/helper-functions/sanitizeObject';
import { Button, Divider } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiInfoCircle, BiPlus } from 'react-icons/bi';
import ItemApiMainInfo from '../_components/main-info';
import { ItemApiTemplateContext } from '../provider';
import type { listApiWithSearchType } from "@/types/list";
import ItemApiQueries from '../_components/api-form/query-templates';
import ItemApiRoutes from '../_components/api-form/route-templates';
import ItemApiSearchLayout from '../_components/api-form/search-layout';
import ItemApiCoverCol from '../_components/item-form/cover-col';
import ItemApiPosterCol from '../_components/item-form/poster-col';
import patchAPI from '@/utils/api/patchAPI';


//pattern of search router shouldn't allow words starting with / or ending with it it shouldn't allow spaces too
// pattern of base url shouldn't allowit to end with '/'

export default function AddAPIPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [listData, setListData] = useState<listData>({} as listData);
    const [searchIsAllowed, setSearchIsAllowed] = useState(false)

    const { handleSubmit, control, setValue, getValues, formState: { errors }, resetField } = useForm<listApiWithSearchType>();

    const pathRegex = /("([^"]*)"|'([^']*)')|[\w\d::>>]+/g

    //force a pattern for queries (which have word = word) and force one for routes

    /** React Hook Form's Input Pattern  */
    const pattern = {
        value: pathRegex,
        message: 'Please enter a valid Path',
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
            console.log("(Item) Error:", "Failed to Add New Item", e)
        }

    };


    return listData.title ? (
        <>
            <ItemApiTemplateContext.Provider value={{ searchIsAllowed, setSearchIsAllowed, control, fieldTemplates, setValue, getValues, errors, pathRegex, pattern }}>

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

                    <div className=' px-4 grid gap-y-3'>
                        <ItemApiMainInfo />
                        <Divider className='my-2' />
                        <div className=' grid grid-cols-3 lg:grid-cols-1 gap-x-4 items-start'>
                            <div className='grid space-y-2'>
                                <p className="text-zinc-500 text-xl">Direct</p>
                                <ItemApiRoutes />
                                <ItemApiQueries />
                            </div>
                            <ItemApiSearchLayout />
                        </div>
                    </div>

                    <TitleBar
                        title="Api Item Template"
                        className="bg-accented p-5 my-5"
                    >
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="shadow-none"
                            target='_blank'
                        >
                            <BiInfoCircle className=" text-2xl" />
                        </Button>
                    </TitleBar>

                    <div className='grid grid-cols-3 gap-x-7 items-start px-4'>
                        <ItemApiPosterCol />
                        <ItemApiCoverCol />
                    </div>

                </form>

            </ItemApiTemplateContext.Provider>
        </>
    ) : (<h1>loading...</h1>)
}
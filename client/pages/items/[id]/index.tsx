import ErrorPage from '@/components/errorPage';
import { authContext } from '@/components/pagesComponents/authProvider';
import ItemLayout1 from "@/components/pagesComponents/items/[id]/layouts/layout1";
import ItemLayout2 from "@/components/pagesComponents/items/[id]/layouts/layout2";
import ItemLayout3 from "@/components/pagesComponents/items/[id]/layouts/layout3";
import type { itemData, itemImageType, itemTag } from "@/types/item";
import { imagesFetchOptions } from "@/utils/query/imagesQueries";
import { itemFetchOptions } from "@/utils/query/itemsQueries";
import { tagsFetchOptions } from "@/utils/query/tagsQueries";
import { useQueries, useQuery } from "@tanstack/react-query";
import Head from 'next/head';
import { useRouter } from "next/router";
import { createContext, useContext } from "react";
import { validate as uuidValidate } from 'uuid';

interface context {
    tagsData: itemTag[]
    itemData: itemData
    imagesData: itemImageType[]
    relatedItems: itemData[]
    coverPath?: string; //COVER is the BACKGROUND IMAGE!!!!!!! NOT the POSTER 
}

export const itemViewContext = createContext({} as context);

function ItemPage() {
    const router = useRouter();
    const itemId = router.query.id as string;

    const { userData } = useContext(authContext)

    const item = useQuery(itemFetchOptions(itemId)) //for related items
    const images = useQuery(imagesFetchOptions(itemId))

    const allTags = useQuery({ ...tagsFetchOptions(item?.data?.list_id as string), enabled: item.isSuccess })
    const relatedItems = useQueries({
        queries: item.isSuccess && item.data.related?.map((id) => ({ ...itemFetchOptions(id), enabled: item.isSuccess })) || []
    })

    const isPendingRelated = relatedItems.some((item) => item.isPending)
    const isErrorRelated = relatedItems.some((item) => item.isError)

    const isPending = item.isPending || images.isPending || isPendingRelated || allTags.isPending
    const isError = isErrorRelated || item.isError || images.isError || allTags.isError

    if (isPending) return <h1>loading...</h1>
    if (isError) return <ErrorPage message="Failed to Fetch Item" />

    // we import the database of tags then check if the id of the tag you have == the one in the database and ignore the rest.
    const tagsData: itemTag[] = item.isSuccess && allTags.data && item.data.tags
        ? item.data.tags.map((id) => allTags?.data.find((tag) => tag.id == id && tag !== undefined)).filter(Boolean) as itemTag[]
        : []

    const relatedItemsData = relatedItems.map((item) => item.data).filter(Boolean) as itemData[]

    const coverPath = item.data.cover_path
        ? `${process.env.PUBLIC_IMG_PATH}/images/${userData.id}/${item.data.list_id}/${item.data.id}/thumbnails/${item.data.cover_path}_size=300xH.webp`
        : item.data.poster_path
            ? `${process.env.PUBLIC_IMG_PATH}/images/${userData.id}/${item.data.list_id}/${item.data.id}/thumbnails/${item.data.poster_path}_size=700xH.webp`
            : undefined


    return (
        <>
            <Head>
                <title>MediaList - {item.data.title}</title>
            </Head>

            <div className="py-5 animate-fade-in" >
                <itemViewContext.Provider value={{ tagsData, itemData: item.data, imagesData: images.data, relatedItems: relatedItemsData, coverPath }}>
                    {item.data.configurations?.layout == "1" && <ItemLayout1 />}
                    {item.data.configurations?.layout == "2" && <ItemLayout2 />}
                    {item.data.configurations?.layout == "3" && <ItemLayout3 />}
                </itemViewContext.Provider>
            </div>
        </>
    )
}

export default function ItemPageHOC() {
    const router = useRouter();
    const itemId = router.query.id as string
    return uuidValidate(itemId) ? <ItemPage /> : <ErrorPage message="Bad Item ID, Page Doesn't Exist" MainMessage="404!" />
}


import ErrorPage from '@/components/errorPage';
import SingleImageUploader, { UploadedImage } from '@/components/forms/_components/Images/single-imageUploader';
import SubmitButtonWithIndicators from '@/components/forms/_components/SubmitWithIndicators';
import ItemApiLoaderDropDown from '@/components/forms/item/api-loader/dropdown';
import ItemApiLoaderProvider from '@/components/forms/item/api-loader/provider';
import { ItemFormCoverColumn, ItemFormPosterColumn } from '@/components/forms/item/layouts';
import { ItemForm, ItemFormContext } from "@/components/forms/item/provider";
import ListsLoading from '@/components/pagesComponents/lists/listsLoading';
import type { itemData, itemTag } from '@/types/item';
import fetchImageFromURL from '@/utils/api/handlers/fetchImageFromURL';
import postAPI from '@/utils/api/postAPI';
import appendObjKeysToFormData from '@/utils/helperFunctions/form/appendObjKeysToFormData';
import handleAddLogosFieldsForm from '@/utils/helperFunctions/form/handleAddLogosFieldsForm';
import { itemsFetchOptions, mutateItemCache } from "@/utils/query/itemsQueries";
import { listFetchOptions } from '@/utils/query/listsQueries';
import { mutateTagCache, tagsFetchOptions } from '@/utils/query/tagsQueries';
import { Button, Divider } from "@nextui-org/react";
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiInfoCircle } from 'react-icons/bi';
import { FaSave } from 'react-icons/fa';
import { validate as uuidValidate } from 'uuid';

export interface apiDataAddItemPage {
    itemData?: itemData
    /** for Each time the api is updated it will increase a key
     * it will be used as key to for the page to force it to rerender from scratch on rendering an api */
    key: number
}

function AddItemPage() {
    const router = useRouter();
    const listId = router.query.id as string

    const { handleSubmit, control, setValue, getValues, formState: { errors } } = useForm<ItemForm>();

    const [apiData, setApiData] = useState({ key: 0 } as apiDataAddItemPage);
    const list = useQuery(listFetchOptions(listId))
    const items = useQuery(itemsFetchOptions(listId)) //for related items
    const tags = useQuery(tagsFetchOptions(listId))

    const isPending = (list.isPending || items.isPending || tags.isPending)
    const isError = (list.isError || items.isError || tags.isError)

    const mutation = useMutation({
        mutationFn: (data: FormData) => postAPI(`items/${listId}`, data),
        onSuccess: ({ newTags, ...itemData }: itemData & { newTags: itemTag[] }) => {
            mutateItemCache(itemData, "add")
            router.push(`../../items/${itemData.id}`)
            if (newTags) newTags.forEach((tag) => mutateTagCache(tag, "add"))
        },
    })

    if (isPending) return <ListsLoading />
    if (isError || !list.data || !items.data || !tags.data) return <ErrorPage message="Failed to Fetch Items" />

    const fieldTemplates = list.data.templates?.fieldTemplates

    async function onSubmit(rawData: ItemForm) {
        type omitData = Omit<itemData, 'cover_path' | 'poster_path' | 'links' | 'badges' | 'tags' | 'related'>;

        // saperate the handling of submitted data
        const { cover_path, poster_path, links: linksData, badges: badgesData, tags, related, ...data } = rawData

        const formData = new FormData();
        appendObjKeysToFormData(formData, data as omitData)

        const tagsArray = tags?.map((tag) => tag.value) || []
        const relatedItemsArray = related?.map((item) => item.value) || []
        formData.append('tags', JSON.stringify(tagsArray))
        formData.append('related', JSON.stringify(relatedItemsArray))

        formData.append('cover_path', (cover_path as UploadedImage)?.[0]?.file
            || await fetchImageFromURL((cover_path as UploadedImage)?.[0]?.dataURL) || '')
        formData.append('poster_path', (poster_path as UploadedImage)?.[0]?.file
            || await fetchImageFromURL((poster_path as UploadedImage)?.[0]?.dataURL) || '')

        const badges = handleAddLogosFieldsForm(badgesData, formData, ' badges')
        const links = handleAddLogosFieldsForm(linksData, formData, 'links')

        formData.append('badges', JSON.stringify(badges))
        formData.append('links', JSON.stringify(links))

        mutation.mutate(formData)
    }

    return (
        <>
            <Head>
                <title>MediaList - {list.data.title} New Item</title>
            </Head>

            <ItemFormContext.Provider value={{
                control,
                fieldTemplates,
                setValue,
                getValues,
                errors,
                itemData: apiData.itemData
            }}>
                <ItemApiLoaderProvider setApiData={setApiData} apiData={apiData} apiTemplates={list.data.templates?.apiTemplates} >
                    <form className="grid grid-cols-3 py-5 gap-x-7 items-start" key={apiData.key}>

                        <div className="col-span-1 grid gap-y-2">
                            <SingleImageUploader control={control} fieldName='poster_path' content="Item's Poster" className='h-44' />
                            <Divider className="my-2" />
                            <div className='flex items-center gap-x-3'>
                                <ItemApiLoaderDropDown>
                                    <Button className='mb-3 h-14 text-lg bg-accented'>
                                        API
                                    </Button>
                                </ItemApiLoaderDropDown>

                                <SubmitButtonWithIndicators
                                    className='mb-3 h-14 text-lg flex-grow'
                                    mutation={mutation}
                                    onClick={handleSubmit(onSubmit)}
                                    saveContent={<>
                                        <FaSave className="text-xl" />
                                        Save Item
                                    </>}
                                />

                            </div>
                            <Divider className="my-2" />

                            <ItemFormPosterColumn listItemsData={items.data} tagsData={tags.data} />
                        </div>

                        <div className="col-span-2 grid gap-y-2">
                            <SingleImageUploader control={control} fieldName='cover_path' content="Item's Cover" className='h-44' />
                            <Divider className="my-2" />
                            <ItemFormCoverColumn />
                            <Divider className="my-2" />
                            <div className='text-zinc-500 flex items-center gap-x-1'>
                                <BiInfoCircle className="flex-none" />
                                <p className=" flex-grow">You can add images after saving the item throgh the Gallery tab</p>
                            </div>
                        </div>

                    </form>
                </ItemApiLoaderProvider>
            </ItemFormContext.Provider>
        </>
    )
}

export default function AddItemPageHOC() {
    const router = useRouter();
    const itemId = router.query.id as string
    return uuidValidate(itemId) ? <AddItemPage /> : <ErrorPage message="Bad List ID, Page Doesn't Exist" MainMessage="404!" />
}
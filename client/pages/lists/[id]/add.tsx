import ErrorPage from '@/components/errorPage';
import SingleImageUploader, { UploadedImage } from '@/components/forms/_components/Images/single-imageUploader';
import SubmitButtonWithIndicators from '@/components/forms/_components/SubmitWithIndicators';
import ItemApiLoaderDropDown from '@/components/forms/item/api-loader/dropdown';
import ItemApiLoaderProvider from '@/components/forms/item/api-loader/provider';
import { ItemFormCoverColumn, ItemFormPosterColumn } from '@/components/forms/item/layouts';
import { ItemFormContext } from "@/components/forms/item/provider";
import type { itemBadgesType, itemData, itemTag, itemlink } from '@/types/item';
import handleImageUpload from '@/utils/api/handlers/handleImageUpload';
import uploadImageFromURL from '@/utils/api/handlers/uploadImageFromURL';
import postAPI from '@/utils/api/postAPI';
import { dateStamped } from '@/utils/helperFunctions/dateStamped';
import getFileExtension from '@/utils/helperFunctions/getFileExtinsion';
import sanitizeObject from '@/utils/helperFunctions/sanitizeObject';
import sanitizeString from '@/utils/helperFunctions/sanitizeString';
import { mutateItemCache } from '@/utils/query/cacheMutation';
import { itemsFetchOptions } from '@/utils/query/queryOptions/itemsOptions';
import { listFetchOptions } from '@/utils/query/queryOptions/listsOptions';
import { tagsFetchOptions } from '@/utils/query/queryOptions/tagsOptions';
import { Button, Divider } from "@nextui-org/react";
import { useMutation, useQuery } from '@tanstack/react-query';
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

export default function AddItemPage() {
    const router = useRouter();
    const listId = router.query.id as string

    if (!uuidValidate(listId)) return <ErrorPage message="Bad List ID, Page Doesn't Exist" MainMessage="404!" />

    const { handleSubmit, control, setValue, getValues, formState: { errors }, resetField } = useForm<itemData>();

    const [apiData, setApiData] = useState({ key: 0 } as apiDataAddItemPage);
    const list = useQuery(listFetchOptions(listId))
    const items = useQuery(itemsFetchOptions(listId)) //for related items
    const tags = useQuery(tagsFetchOptions(listId))

    const isPending = (list.isPending || items.isPending || tags.isPending)
    const isError = (list.isError || items.isError || tags.isError)

    const mutation = useMutation({
        mutationFn: (data: Partial<itemData>) => postAPI(`items/${listId}`, data),
        onSuccess: (data) => {
            mutateItemCache(data, "add")
            router.push(`../../items/${data.id}`)
        },
    })

    if (isPending) return <h1>loading...</h1>
    if (isError || !list.data || !items.data || !tags.data) return <ErrorPage message="Failed to Fetch Items" />

    let orderCounter = 0 //to give every image a unique value

    const fieldTemplates = list.data.templates?.fieldTemplates

    async function handleTags(originalArray: string[]) {
        let toPostAPI: itemTag[] = []
        const newArray = originalArray.map((tag) => {
            if (uuidValidate(tag)) {
                return tag //if tag is uuid then it already exists in the database
            } else {
                //if tag isn't a uuid then it is a new tag 
                if (!tag) return
                const id = crypto.randomUUID();
                sanitizeString(tag)
                toPostAPI.push({ id, name: tag })
                return id
            }
        })
        if (toPostAPI.length > 0) postAPI(`tags/${listId}`, { body: toPostAPI })
        return newArray
    }

    const handleImage = async (image?: UploadedImage) => {
        if (!(image && image[0])) return null
        orderCounter++
        let imageName = ''
        if (image[0].file) {
            /** only manually uploaded images have image[0].file  */
            imageName = dateStamped(`${orderCounter}.${getFileExtension(image[0].file.name)}`);
            await handleImageUpload(image, "items", imageName);
        } else {
            imageName = dateStamped(`${orderCounter}.${getFileExtension(image[0].dataURL)}`);
            await uploadImageFromURL(image[0].dataURL, "items", imageName);
        }
        return imageName;
    }

    const handleLogosFields = async (array: (itemBadgesType | itemlink)[]) => {
        return array.map((e) => {
            orderCounter++
            if (typeof (e.logo_path) === 'string' || e.logo_path === undefined) {
                return e
            } else if (typeof (e.logo_path) === 'object') {
                const logoName = dateStamped(`${orderCounter}.${getFileExtension(e.logo_path[0].file.name)}`)
                handleImageUpload(e.logo_path, "logos", logoName);
                e.logo_path = logoName
                return e
            }
        })
    }

    async function onSubmit(rawData: itemData) {
        // console.log("rawData", rawData) //devmode
        // saperate the handling of submitted data
        const { rawPoster, rawCover, tags, links, badges, ...data }: any = rawData

        if (tags.length > 0) data['tags'] = await handleTags(tags)
        data['poster_path'] = await handleImage(rawPoster)
        data['cover_path'] = await handleImage(rawCover)

        // links and badges have logos that should be uploaded
        data['links'] = await handleLogosFields(links)
        data['badges'] = await handleLogosFields(badges)
        sanitizeObject(data)

        mutation.mutate(data)
        // console.log("final data", data)//devmode
    }

    return (
        <ItemFormContext.Provider value={{ control, fieldTemplates, setValue, getValues, errors, itemData: apiData.itemData }}>
            <ItemApiLoaderProvider setApiData={setApiData} apiData={apiData} apiTemplates={list.data.templates?.apiTemplates} >
                <form className="grid grid-cols-3 py-5 gap-x-7 items-start" key={apiData.key}>

                    <div className="col-span-1 grid gap-y-2">
                        <SingleImageUploader control={control} fieldName='rawPoster' content="Item's Poster" className='h-44' />
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
                        <SingleImageUploader control={control} fieldName='rawCover' content="Item's Cover" className='h-44' />
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
        </ItemFormContext.Provider >
    )
}
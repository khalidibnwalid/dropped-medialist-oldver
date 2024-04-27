import ErrorPage from "@/components/errorPage";
import { UploadedImage } from "@/components/forms/_components/Images/single-imageUploader";
import SingleImageUploaderDefault from '@/components/forms/_components/Images/single-imageUploader-defaultValue';
import SubmitButtonWithIndicators from "@/components/forms/_components/SubmitWithIndicators";
import { ItemFormCoverColumn, ItemFormPosterColumn } from "@/components/forms/item/layouts";
import { ItemFormContext } from "@/components/forms/item/provider";
import { authContext } from "@/components/pagesComponents/authProvider";
import ItemPageGallery from "@/components/pagesComponents/items/[id]/tabs/itempage-gallery";
import type { itemData, itemTag } from '@/types/item';
import deleteAPI from '@/utils/api/deleteAPI';
import { handleEditingLogosFields } from '@/utils/api/handlers/handleEditingLogosFields';
import handleImageUpload from '@/utils/api/handlers/handleImageUpload';
import patchAPI from '@/utils/api/patchAPI';
import postAPI from '@/utils/api/postAPI';
import { dateStamped } from '@/utils/helperFunctions/dateStamped';
import getFileExtension from '@/utils/helperFunctions/getFileExtinsion';
import sanitizeObject from '@/utils/helperFunctions/sanitizeObject';
import sanitizeString from '@/utils/helperFunctions/sanitizeString';
import { mutateItemCache } from "@/utils/query/cacheMutation";
import { imagesFetchOptions } from "@/utils/query/queryOptions/imagesOptions";
import { itemFetchOptions, itemsFetchOptions } from "@/utils/query/queryOptions/itemsOptions";
import { listFetchOptions } from "@/utils/query/queryOptions/listsOptions";
import { tagsFetchOptions } from "@/utils/query/queryOptions/tagsOptions";
import { Button, Divider } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiX } from 'react-icons/bi';
import { FaSave } from 'react-icons/fa';
import { validate as uuidValidate } from 'uuid';

export default function EditItemPage() {
    const router = useRouter();
    const itemId = router.query.id as string

    if (!uuidValidate(itemId)) return <ErrorPage message="Bad Item ID, Page Doesn't Exist" MainMessage="404!" />

    const { handleSubmit, control, setValue, getValues, resetField, formState: { errors } } = useForm<itemData>();
    const [keyRefresher, setKeyRefresher] = useState(0)

    const { userData } = useContext(authContext)

    //import tags of the list in useEffect (client side)
    const item = useQuery(itemFetchOptions(itemId)) //for related items
    const images = useQuery(imagesFetchOptions(itemId))

    const listId = item.data?.list_id as string

    const list = useQuery({ ...listFetchOptions(listId), enabled: item.isSuccess })
    const tags = useQuery({ ...tagsFetchOptions(listId), enabled: item.isSuccess })
    const listItems = useQuery({ ...itemsFetchOptions(listId), enabled: item.isSuccess })

    const isError = item.isError || list.isError || tags.isError || listItems.isError || images.isError
    const isPending = item.isPending || list.isPending || tags.isPending || listItems.isPending || images.isPending
    const isSuccess = item.isSuccess && list.isSuccess && tags.isSuccess && listItems.isSuccess && images.isSuccess

    const mutation = useMutation({
        mutationFn: (data: Partial<itemData>) => patchAPI(`items/${itemId}`, data),
        onSuccess: (data) => {
            mutateItemCache(data, "edit")
            router.push(`../../items/${data.id}`)
        },
    })

    useEffect(() => {
        if (isSuccess) {
            setValue("badges", item.data.badges)
            setValue("links", item.data.links)
            setValue("main_fields", item.data.main_fields)
            setValue("extra_fields", item.data.extra_fields)
            setValue("tags", item.data.tags)
            setValue("content_fields", item.data.content_fields)
            setKeyRefresher(n => n + 1)
        }
    }, [isSuccess])

    if (isPending) return <h1>loading...</h1>
    if (isError) return <ErrorPage message="Failed to Fetch Item" />

    const listItemsData = listItems.data.filter((item) => item.id !== itemId) // for related items
    const fieldTemplates = list.data.templates?.fieldTemplates
    let orderCounter = 0 //to give every image a unique value

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
        // console.log("postAPI", toPostAPI) // devmode
        if (toPostAPI.length > 0) postAPI(`tags/${listId}`, { body: toPostAPI })
        return newArray
    }

    const handleImage = async (image?: UploadedImage, path?: string) => {
        if (image && image[0]) {
            orderCounter++
            const imageName = dateStamped(`${orderCounter.toString()}.${getFileExtension(image[0].file.name)}`)
            handleImageUpload(image, "items", imageName)
            //remove the image after uploading the new one
            if (path) deleteAPI('files', { fileNames: [`images/items/${path}`] })
            return imageName;
        } else if (image === null) {
            //if null onle remove the cover
            deleteAPI('files', { fileNames: [`images/items/${path}`] })
            return null
        }
    }

    async function onSubmit(rawData: itemData) {
        // console.log("rawData", rawData)
        // saperate the handling of submitted data
        let finalData: Partial<itemData> = {}
        if (!item.data) return
        const { rawPoster, rawCover, tags, links, badges, ...data }: any = rawData

        try {
            if (tags.length > 0) data['tags'] = await handleTags(tags)

            data['poster_path'] = await handleImage(rawPoster, item.data.poster_path as string)
            data['cover_path'] = await handleImage(rawCover, item.data.cover_path as string)

            //handle links and badges cause they have logos that should be uploaded
            data['links'] = await handleEditingLogosFields(links, item.data.links, orderCounter, item.data.list_id, fieldTemplates?.links)
            data['badges'] = await handleEditingLogosFields(badges, item.data.badges, orderCounter, item.data.list_id, fieldTemplates?.badges)

            Object.keys(data).forEach((key) => {
                if (data[key] != item.data[key as keyof itemData]) {
                    finalData[key as keyof itemData] = data[key]
                }
            })

            sanitizeObject(finalData)
            // console.log("Final Data", finalData)
            mutation.mutate(finalData)
        } catch (e) {
            console.log("(Item) Error:", "Failed to Edit Item", e)
        }

    };

    return (
        <ItemFormContext.Provider value={{ control, fieldTemplates, setValue, getValues, errors, itemData: item.data, resetField }}>
            <form className="grid grid-cols-3 py-5 gap-x-7 items-start" key={keyRefresher}>

                <div className="col-span-1 grid gap-y-2">
                    <SingleImageUploaderDefault
                        className='h-44'
                        control={control}
                        fieldName="rawPoster"
                        resetField={resetField}
                        setValue={setValue}
                        content="Item's Poster"
                        imgSrc={item.data.poster_path ? `${process.env.PUBLIC_IMG_PATH}/users/${userData.id}/images/items/${item.data.poster_path}` : undefined}
                    />
                    <Divider className="my-2" />

                    <div className='flex gap-x-2'>
                        <Button
                            onClick={() => { router.push(`/items/${item.data.id}`) }}
                            className="focus:outline-none h-14 w-14 bg-accented"
                            type="button"
                            isIconOnly
                        >
                            <BiX className="text-4xl" />
                        </Button>

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
                    <ItemFormPosterColumn listItemsData={listItemsData} tagsData={tags.data} />
                </div>

                <div className="col-span-2 grid gap-y-2">
                    <SingleImageUploaderDefault
                        className='h-44 aspect-none'
                        control={control}
                        fieldName="rawCover"
                        resetField={resetField}
                        setValue={setValue}
                        content="Item's Cover"
                        imgSrc={item.data.cover_path ? `${process.env.PUBLIC_IMG_PATH}/users/${userData.id}/images/items/${item.data.cover_path}` : undefined}
                    />
                    <Divider className="my-2" />
                    <ItemFormCoverColumn />
                    <Divider className="my-2" />
                    <ItemPageGallery imageArray={images.data} item={item.data} />
                </div>

            </form>
        </ItemFormContext.Provider>
    )
}
'use client'

import "dotenv/config";
import SingleImageUploaderDefault from '@/components/forms/_components/Images/single-imageUploader-defaultValue';
import { ItemFormCoverColumn, ItemFormPosterColumn } from "@/components/forms/item/layouts";
import { ItemFormContext } from "@/components/forms/item/provider";
import type { listData } from '@/types/list';
import type { itemData, itemImageType, itemTag } from '@/types/item';
import deleteAPI from '@/utils/api/deleteAPI';
import fetchAPI from '@/utils/api/fetchAPI';
import { handleEditingLogosFields } from '@/utils/api/handlers/handleEditingLogosFields';
import handleImageUpload from '@/utils/api/handlers/handleImageUpload';
import patchAPI from '@/utils/api/patchAPI';
import postAPI from '@/utils/api/postAPI';
import { dateStamped } from '@/utils/helper-functions/dateStamped';
import getFileExtension from '@/utils/helper-functions/getFileExtinsion';
import sanitizeObject from '@/utils/helper-functions/sanitizeObject';
import sanitizeString from '@/utils/helper-functions/sanitizeString';
import { Button, Divider } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiX } from 'react-icons/bi';
import { FaSave } from 'react-icons/fa';
import { validate as uuidValidate } from 'uuid';
import ItemPageGallery from '../_components/tabs/itempage-gallery';
import { UploadedImage } from "@/components/forms/_components/Images/single-imageUploader";

export default function EditItemPage({ params }: { params: { id: string } }) {
    const { handleSubmit, control, setValue, getValues, resetField, formState: { errors } } = useForm<itemData>();
    const router = useRouter();

    //import tags of the list in useEffect (client side)
    const [itemData, setItemData] = useState<itemData>({} as itemData);
    const [tagsData, setTagsData] = useState<itemTag[]>([]);
    const [listItemsData, setListItemsData] = useState<itemData[]>([]);
    const [listData, setListData] = useState<listData>({} as listData);
    const [imageArray, setImageArray] = useState<itemImageType[]>([]);

    let orderCounter = 0 //to give every image a unique value

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: itemData = await fetchAPI(`items/id/${params.id}`);
                setItemData(data);
                //should be set right after we got the data, otherwise they won't appaer
                setValue("badges", data.badges)
                setValue("links", data.links)
                setValue("main_fields", data.main_fields)
                setValue("extra_fields", data.extra_fields)
                setValue("tags", data.tags)
                setValue("content_fields", itemData.content_fields)

                const tags: itemTag[] = await fetchAPI(`tags/${data.list_id}`)
                setTagsData(tags);

                const listItemsData: itemData[] = await fetchAPI(`items/${data.list_id}`)
                const filteredlistItemsData = listItemsData.filter((item) => item.id !== params.id)
                //we don't want the edited item to be in the related items list
                setListItemsData(filteredlistItemsData);

                const listData: listData = await fetchAPI(`lists/${data.list_id}`)
                setListData(listData);

                const dataImages: itemImageType[] = await fetchAPI(`images/${params.id}`);
                setImageArray(dataImages)

            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, []);

    const fieldTemplates = listData.templates?.fieldTemplates

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
        if (toPostAPI.length > 0) postAPI(`tags/${params.id}`, { body: toPostAPI })
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
        let finalData = {} as itemData
        const { rawPoster, rawCover, tags, links, badges, ...data }: any = rawData

        try {
            if (tags.length > 0) data['tags'] = await handleTags(tags)

            data['poster_path'] = await handleImage(rawPoster, itemData.poster_path as string)
            data['cover_path'] = await handleImage(rawCover, itemData.cover_path as string)

            //handle links and badges cause they have logos that should be uploaded
            data['links'] = await handleEditingLogosFields(links, itemData.links, orderCounter, itemData.list_id, fieldTemplates?.links)
            data['badges'] = await handleEditingLogosFields(badges, itemData.badges, orderCounter, itemData.list_id, fieldTemplates?.badges)

            //filter unchanged value to avoid unneeded changes
            for (let key in data) {
                if (data.hasOwnProperty(key) && itemData.hasOwnProperty(key)) {
                    if (data[key] != itemData[key as keyof itemData]) {
                        finalData[key] = data[key]
                    }
                }
            }

            sanitizeObject(finalData)
            // console.log("Final Data", finalData)
            await patchAPI(`items/${itemData.id}`, finalData)
            router.push(`/Items/${params.id}`)
            //send a toast of the item being saved
        } catch (e) {
            console.log("(Item) Error:", "Failed to Edit Item", e)
        }

    };

    return ((Object.keys(itemData).length > 0) && (Object.keys(listData).length > 0)) ? (
        <>
            <ItemFormContext.Provider value={{ control, fieldTemplates, setValue, getValues, errors, itemData, resetField }}>
                <form className="grid grid-cols-3 py-5 gap-x-7 items-start">

                    <div className="col-span-1 grid gap-y-2">
                        <SingleImageUploaderDefault
                            className='h-44'
                            control={control}
                            fieldName="rawPoster"
                            resetField={resetField}
                            setValue={setValue}
                            content="Item's Poster"
                            imgSrc={itemData.poster_path ? `${process.env.PUBLIC_IMG_PATH}/images/items/${itemData.poster_path}` : undefined}
                        />
                        <Divider className="my-2" />

                        <div className='flex gap-x-2'>
                            <Button
                                onClick={() => { router.push(`/Items/${itemData.id}`) }}
                                className="focus:outline-none h-14 w-14 bg-accented"
                                type="button"
                                isIconOnly
                            >
                                <BiX className="text-4xl" />
                            </Button>

                            <Button
                                className='mb-3 h-14 text-lg flex-grow'
                                onClick={handleSubmit(onSubmit)}
                            >
                                <FaSave className="text-xl" />
                                Save Item
                            </Button>

                        </div>

                        <Divider className="my-2" />
                        <ItemFormPosterColumn listItemsData={listItemsData} tagsData={tagsData} />
                    </div>

                    <div className="col-span-2 grid gap-y-2">
                        <SingleImageUploaderDefault
                            className='h-44 aspect-none'
                            control={control}
                            fieldName="rawCover"
                            resetField={resetField}
                            setValue={setValue}
                            content="Item's Cover"
                            imgSrc={itemData.cover_path ? `${process.env.PUBLIC_IMG_PATH}/images/items/${itemData.cover_path}` : undefined}
                        />
                        <Divider className="my-2" />
                        <ItemFormCoverColumn />
                        <Divider className="my-2" />
                        <ItemPageGallery imageArray={imageArray} item={itemData} />
                    </div>

                </form>
            </ItemFormContext.Provider>
        </>
    ) : <h1>Loading</h1>
}
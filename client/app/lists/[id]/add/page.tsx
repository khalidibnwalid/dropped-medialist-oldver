'use client'

import ItemApiLoaderDropDown from '@/app/lists/[id]/add/_components/api-loader/dropdown';
import SingleImageUploader, { UploadedImage } from '@/components/forms/_components/Images/single-imageUploader';
import { ItemFormCoverColumn, ItemFormPosterColumn } from '@/components/forms/item/layouts';
import { ItemFormContext } from "@/components/forms/item/provider";
import type { itemBadgesType, itemData, itemTag, itemlink } from '@/types/item';
import type { listData } from '@/types/list';
import deleteAPI from '@/utils/api/deleteAPI';
import fetchAPI from '@/utils/api/fetchAPI';
import handleImageUpload from '@/utils/api/handlers/handleImageUpload';
import uploadImageFromURL from '@/utils/api/handlers/uploadImageFromURL';
import postAPI from '@/utils/api/postAPI';
import { dateStamped } from '@/utils/helper-functions/dateStamped';
import getFileExtension from '@/utils/helper-functions/getFileExtinsion';
import sanitizeObject from '@/utils/helper-functions/sanitizeObject';
import sanitizeString from '@/utils/helper-functions/sanitizeString';
import { Button, Divider } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiInfoCircle } from 'react-icons/bi';
import { FaSave } from 'react-icons/fa';
import { validate as uuidValidate } from 'uuid';
import ItemApiLoaderProvider from './_components/api-loader/provider';

export interface apiDataAddItemPage {
    itemData?: itemData
    /** for Each time the api is updated it will increase a key 
     * it will be used as key to for the page to force it to rerender from scratch on rendering an api */
    key: number
}

export default function AddItemPage({ params }: { params: { id: string } }) {
    const { handleSubmit, control, setValue, getValues, formState: { errors }, resetField } = useForm<itemData>();
    const router = useRouter();

    //import tags of the list in useEffect (client side)
    const [tagsData, setTagsData] = useState<itemTag[]>([]);
    const [listItemsData, setListItemsData] = useState<itemData[]>([]);
    const [listData, setListData] = useState<listData>({} as listData);

    const [apiData, setApiData] = useState({ key: 0 } as apiDataAddItemPage);

    let orderCounter = 0 //to give every image a unique value

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAPI(`tags/${params.id}`)
                setTagsData(data);
                const listData = await fetchAPI(`lists/${params.id}`)
                // if (Object.keys(listData).length == 0) throw Error("List Doesn't Exist")
                setListData(listData);
                const listItemsData = await fetchAPI(`items/${params.id}`)
                setListItemsData(listItemsData);

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
        if (toPostAPI.length > 0) postAPI(`tags/${params.id}`, { body: toPostAPI })
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

        try {
            // console.log("final data", data)//devmode
            await postAPI(`items/${params.id}`, data)
            router.push(`../../lists/${params.id}`)
            //send a toast of the item being saved or make the items cover shine
        } catch (e) {
            console.log("(Item) Error:", "Failed to Add New Item", e)
            let fileNames: string[] = []
            //delete all uploaded files
            data.poster_path && fileNames.push(data.poster_path)
            data.cover_path && fileNames.push(data.cover_path)
            deleteAPI('files', { fileNames })
        }

    };

    return listData.title ? (
        <ItemFormContext.Provider value={{ control, fieldTemplates, setValue, getValues, errors, itemData: apiData.itemData }}>
            <ItemApiLoaderProvider setApiData={setApiData} apiData={apiData} apiTemplates={listData.templates?.apiTemplates} >
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
    ) : (<h1>loading...</h1>)
}
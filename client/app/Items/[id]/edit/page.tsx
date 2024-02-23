'use client'

import SingleImageUploaderDefault from '@/components/forms/single-imageUploader-defaultValue';
import type { CollectionData, fieldTemplates } from '@/types/collection';
import type { itemData, itemImageType, itemTag } from '@/types/item';
import deleteAPI from '@/utils/api/deleteAPI';
import fetchAPI from '@/utils/api/fetchAPI';
import handleImageUpload from '@/utils/api/handlers/handleImageUpload';
import { handleEditingLogosFields } from '@/utils/api/handlers/handleEditingLogosFields';
import patchAPI from '@/utils/api/patchAPI';
import postAPI from '@/utils/api/postAPI';
import { dateStamped } from '@/utils/helper-functions/dateStamped';
import getFileExtension from '@/utils/helper-functions/getFileExtinsion';
import sanitizeObject from '@/utils/helper-functions/sanitizeObject';
import sanitizeString from '@/utils/helper-functions/sanitizeString';
import { Button, Divider } from "@nextui-org/react";
import { IMG_PATH } from "@/app/page";
import { useRouter } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';
import type { FieldErrors, UseFormGetValues, UseFormResetField } from 'react-hook-form';
import { Control, UseFormSetValue, useForm } from 'react-hook-form';
import { BiX } from 'react-icons/bi';
import { FaSave } from 'react-icons/fa';
import ItemPageGallery from '../_components/tabs/itempage-gallery';
import EditItemBadges from './_components/edititem-badges';
import EditExtraFields from './_components/edititem-extra-fields';
import EditExtraInfo from './_components/edititem-extra-info';
import EditLinksFields from './_components/edititem-links-fields';
import EditMainFields from './_components/edititem-main-fields';
import EditMainInfo from './_components/edititem-maininfo';
import EditNoteFields from './_components/edititem-notefields';
import EditItemProgressState from './_components/edititem-progressstate';
import EditRelatedItems from './_components/edititem-related';
import EditTagsFields from './_components/edititem-tagsfields';
import { validate as uuidValidate } from 'uuid';


interface context {
    control: Control<itemData>
    fieldTemplates?: fieldTemplates
    setValue: UseFormSetValue<itemData>
    getValues: UseFormGetValues<itemData>
    errors: FieldErrors<itemData>
    itemData: itemData
    resetField: UseFormResetField<itemData>
}

export const EditItemPageContext = createContext({} as context)

// should setup patter for every input and an array (including tags)
export default function ItemEdit_Page({ params }: { params: { id: string } }) {
    // check the types (typescript) in" react hook form" docs
    const { handleSubmit, control, setValue, getValues, resetField, formState: { errors } } = useForm<itemData>();
    const router = useRouter();

    //import tags of the collection in useEffect (client side)
    const [itemData, setItemData] = useState<itemData>({} as itemData);
    const [tagsData, setTagsData] = useState<itemTag[]>([]);
    const [collectionItemsData, setcollectionItemsData] = useState<itemData[]>([]);
    const [collectionData, setcollectionData] = useState<CollectionData>({} as CollectionData);
    const [imageArray, setImageArray] = useState<itemImageType[]>([]);

    let timeCounter = 0 //to give every image a unique value

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

                const tags: itemTag[] = await fetchAPI(`tags/${data.collection_id}`)
                setTagsData(tags);

                const collectionItemsData: itemData[] = await fetchAPI(`items/${data.collection_id}`)
                const filteredCollectionItemsData = collectionItemsData.filter((item) => item.id !== params.id)
                //we don't want the edited item to be in the related items list
                setcollectionItemsData(filteredCollectionItemsData);

                const collectionData: CollectionData = await fetchAPI(`collections/${data.collection_id}`)
                setcollectionData(collectionData);

                const dataImages: itemImageType[] = await fetchAPI(`images/${params.id}`);
                setImageArray(dataImages)

            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, []);

    const fieldTemplates = collectionData.templates?.fieldTemplates

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
        if (toPostAPI.length > 0) postAPI(`tags/${params.id}?id=true`, { body: toPostAPI })
        return newArray
    }

    const handleImage = async (image: File | undefined, path: string | null | undefined) => {
        if (image && image[0]) {
            timeCounter++
            const imageName = dateStamped(`${timeCounter.toString()}.${getFileExtension(image[0].file.name)}`)
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
        let finalData: itemData = {} as itemData
        const { rawPoster, rawCover, tags, links, badges, ...data }: any = rawData

        try {
            if (tags.length > 0) data['tags'] = await handleTags(tags)

            data['poster_path'] = await handleImage(rawPoster, itemData.poster_path)
            data['cover_path'] = await handleImage(rawCover, itemData.cover_path)

            //handle links and badges cause they have logos that should be uploaded
            data['links'] = await handleEditingLogosFields(links, itemData.links, timeCounter, itemData.collection_id, fieldTemplates?.links)
            data['badges'] = await handleEditingLogosFields(badges, itemData.badges, timeCounter, itemData.collection_id, fieldTemplates?.badges)

            //filter unchanged value to avoid unneeded changes
            for (let key in data) {
                if (data.hasOwnProperty(key) && itemData.hasOwnProperty(key)) {
                    if (data[key] != itemData[key]) {
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

    return ((Object.keys(itemData).length > 0) && (Object.keys(collectionData).length > 0)) ? (
        <>
            <EditItemPageContext.Provider value={{ control, fieldTemplates, setValue, getValues, errors, itemData, resetField }}>
                <form className="grid grid-cols-3 py-5 gap-x-7 items-start">

                    <div className="col-span-1 grid gap-y-2">
                        <SingleImageUploaderDefault
                            className='h-44'
                            control={control}
                            fieldName="rawPoster"
                            resetField={resetField}
                            setValue={setValue}
                            content="Item's Poster"
                            imgSrc={itemData.poster_path ? `${IMG_PATH}/images/items/${itemData.poster_path}` : undefined}
                        />
                        <Divider className="my-2" />

                        <div className='flex gap-x-2'>
                            <Button
                                onClick={() => { router.push(`/Items/${itemData.id}`) }}
                                className="focus:outline-none h-14 w-14"
                                variant="solid"
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
                        <EditItemProgressState />
                        <Divider className="my-2" />
                        <EditItemBadges />
                        <Divider className="my-2" />
                        <EditMainFields />
                        <Divider className="my-2" />
                        <EditLinksFields />
                        <Divider className="my-2" />
                        <EditTagsFields tagsData={tagsData} />
                        <Divider className="my-2" />
                        <EditExtraFields />
                        <Divider className="my-2" />
                        <EditRelatedItems dataSet={collectionItemsData} />

                    </div>

                    <div className="col-span-2 grid gap-y-2">
                        <SingleImageUploaderDefault
                            className='h-44 aspect-none'
                            control={control}
                            fieldName="rawCover"
                            resetField={resetField}
                            setValue={setValue}
                            content="Item's Cover"
                            imgSrc={itemData.cover_path ? `${IMG_PATH}/images/items/${itemData.cover_path}` : undefined}
                        />
                        <Divider className="my-2" />
                        <EditMainInfo />
                        <Divider className="my-2" />
                        <EditExtraInfo />
                        <Divider className="my-2" />
                        <EditNoteFields />
                        <Divider className="my-2" />
                        <ItemPageGallery imageArray={imageArray} item={itemData} />


                    </div>

                </form>
            </EditItemPageContext.Provider>
        </>
    ) : <h1>Loading</h1>
}
'use client'

import SingleImageUploader from '@/components/forms/single-imageUploader';
import type { CollectionData, fieldTemplates } from '@/types/collection';
import type { itemBadgesType, itemData, itemTag, itemlink } from '@/types/item';
import deleteAPI from '@/utils/api/deleteAPI';
import fetchAPI from '@/utils/api/fetchAPI';
import handleImageUpload from '@/utils/api/handlers/handleImageUpload';
import postAPI from '@/utils/api/postAPI';
import { dateStamped } from '@/utils/helper-functions/dateStamped';
import getFileExtension from '@/utils/helper-functions/getFileExtinsion';
import sanitizeObject from '@/utils/helper-functions/sanitizeObject';
import sanitizeString from '@/utils/helper-functions/sanitizeString';
import { Button, Divider } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';
import type { FieldErrors, UseFormGetValues } from 'react-hook-form';
import { Control, UseFormSetValue, useForm } from 'react-hook-form';
import { BiInfoCircle } from 'react-icons/bi';
import AddItemBadges from './_components/additem-badges';
import AddExtraFields from "./_components/additem-extra-fields";
import AddExtraInfo from './_components/additem-extra-info';
import AddLinksFields from "./_components/additem-links-fields";
import AddMainFields from "./_components/additem-main-fields";
import AddMainInfo from './_components/additem-maininfo';
import AddNoteFields from "./_components/additem-notefields";
import SetItemProgressState from './_components/additem-progressstate';
import AddRelatedItems from './_components/additem-related';
import AddRSS from './_components/additem-rss';
import AddTagsFields from "./_components/additem-tagsfields";
import { validate as uuidValidate } from 'uuid';
import type { Metadata } from 'next';

interface context {
    control: Control<itemData>
    fieldTemplates?: fieldTemplates
    setValue: UseFormSetValue<itemData>
    getValues: UseFormGetValues<itemData>
    errors: FieldErrors<itemData>
}


//create a type or interface for items form

export const AddItemPageContext = createContext({} as context)

// should setup patter for every input and an array (including tags)
export default function AddItemPage({ params }: { params: { id: string } }) {
    // check the types (typescript) in" react hook form" docs
    const { handleSubmit, control, setValue, getValues, formState: { errors } } = useForm<itemData>();
    const router = useRouter();

    //import tags of the collection in useEffect (client side)
    const [tagsData, setTagsData] = useState<itemTag[]>([]);
    const [collectionItemsData, setcollectionItemsData] = useState<itemData[]>([]);
    const [collectionData, setcollectionData] = useState<CollectionData>({} as CollectionData);

    let timeCounter = 0 //to give every image a unique value

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAPI(`tags/${params.id}`)
                setTagsData(data);
                const collectionData = await fetchAPI(`collections/${params.id}`)
                // if (Object.keys(collectionData).length == 0) throw Error("Collection Doesn't Exist")
                setcollectionData(collectionData);
                const collectionItemsData = await fetchAPI(`items/${params.id}`)
                setcollectionItemsData(collectionItemsData);

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

    const handleImage = async (image: File | undefined) => {
        if (image && image[0]) {
            timeCounter++;
            const imageName = dateStamped(`${timeCounter.toString()}.${getFileExtension(image[0].file.name)}`);
            await handleImageUpload(image, "items", imageName);
            return imageName;
        }
        return null;
    }

    const handleLogosFields = async (array: (itemBadgesType | itemlink)[]) => {
        return array.map((e) => {
            timeCounter++
            if (typeof (e.logo_path) === 'string' || e.logo_path === undefined) {
                return e
            } else if (typeof (e.logo_path) === 'object') {
                const logoName = dateStamped(`${timeCounter.toString()}.${getFileExtension(e.logo_path[0].file.name)}`)
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

        // default for fav and trash
        data['fav'] = false;
        data['trash'] = false;

        //handle tags
        if (tags.length > 0) data['tags'] = await handleTags(tags)

        //poster
        data['poster_path'] = await handleImage(rawPoster)

        //cover
        data['cover_path'] = await handleImage(rawCover)

        //handle links and badges cause they have logos that should be uploaded
        data['links'] = await handleLogosFields(links)
        data['badges'] = await handleLogosFields(badges)
        sanitizeObject(data)


        try {
            // console.log("final data", data)//devmode
            await postAPI(`items/${params.id}`, data) 
            router.push(`../../Collections/${params.id}`) 
            //send a toast of the item being saved or make the items cover shine
        } catch (e) {
            console.log("(Item) Error:", "Failed to Add New Item", e)
            let fileNames: string[] = []
            //delete all uploaded files
            data.poster_path && fileNames.push(data.poster_path)
            data.cover_path && fileNames.push(data.cover_path)
            data.links && data.links.map((link: itemlink) => fileNames.push(link.logo_path))
            data.badges && data.badges.map((badge: itemBadgesType) => fileNames.push(badge.logo_path))
            deleteAPI('files', { fileNames })
        }

    };

    return collectionData.title ? (
        <>
            <AddItemPageContext.Provider value={{ control, fieldTemplates, setValue, getValues, errors }}>
                <form className="grid grid-cols-3 py-5 gap-x-7 items-start">

                    <div className="col-span-1 grid gap-y-2">
                        <SingleImageUploader control={control} fieldName='rawPoster' content="Item's Poster" className='h-44' />
                        <Divider className="my-2" />

                        <Button className='mb-3 h-14 text-lg' onClick={handleSubmit(onSubmit)}>Save Item</Button>

                        <SetItemProgressState />
                        <Divider className="my-2" />
                        <AddItemBadges />
                        <Divider className="my-2" />
                        <AddMainFields />
                        <Divider className="my-2" />
                        <AddLinksFields />
                        <Divider className="my-2" />
                        <AddTagsFields tagsData={tagsData} />
                        <Divider className="my-2" />
                        <AddExtraFields />
                        <Divider className="mb-2" />
                        <AddRelatedItems dataSet={collectionItemsData} />
                        <Divider className="my-2" />
                        <AddRSS />
                    </div>

                    <div className="col-span-2 grid gap-y-2">
                        <SingleImageUploader control={control} fieldName='rawCover' content="Item's Cover" className='h-44' />
                        <Divider className="my-2" />
                        <AddMainInfo />
                        <Divider className="my-2" />
                        <AddExtraInfo />
                        <Divider className="my-2" />
                        <AddNoteFields />
                        <Divider className="my-2" />
                        <div className='text-zinc-500 flex items-center gap-x-1'>
                            <BiInfoCircle className="flex-none" />
                            <p className=" flex-grow">You can add images after saving the item throgh the Gallery tab</p>
                        </div>
                    </div>

                </form>
            </AddItemPageContext.Provider>
        </>
    ) : (<h1>loading...</h1>)
}
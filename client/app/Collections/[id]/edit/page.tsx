'use client'

import { IMG_PATH } from "@/app/page";
import TitleBar from "@/components/bars/titlebar";
import SingleImageUploaderDefault from "@/components/forms/_components/Images/single-imageUploader-defaultValue";
import CollectionMainInfoForm from "@/components/forms/collection/components/main-info";
import { CollectionFormLowerLayout } from "@/components/forms/collection/layouts";
import { CollectionFormContext } from "@/components/forms/collection/provider";
import { CollectionData } from "@/types/collection";
import deleteAPI from "@/utils/api/deleteAPI";
import fetchAPI from "@/utils/api/fetchAPI";
import { handleEditingLogosFields } from "@/utils/api/handlers/handleEditingLogosFields";
import handleImageUpload from "@/utils/api/handlers/handleImageUpload";
import patchAPI from "@/utils/api/patchAPI";
import { dateStamped } from "@/utils/helper-functions/dateStamped";
import getFileExtension from "@/utils/helper-functions/getFileExtinsion";
import { Button, Tooltip } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { BiInfoCircle, BiSolidPencil, BiX } from "react-icons/bi";
import { FaSave } from "react-icons/fa";
import { IoGridOutline } from "react-icons/io5";
import LoadingCollections from "../../loading";

type form = CollectionData & { rawCover?: any }

export default function EditCollectionPage({ params }: { params: { id: string } }) {

    const [collectionData, setcollectionData] = useState<CollectionData>({} as CollectionData);
    const router = useRouter();

    const { handleSubmit, control, setValue, getValues, formState: { errors }, resetField } = useForm<form>();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData: CollectionData = await fetchAPI(`collections/${params.id}`)
                setcollectionData(fetchedData);
                setValue(`templates`, fetchedData?.templates) //to set templates
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchData();
    }, []);

    const fieldTemplates = collectionData.templates?.fieldTemplates

    let orderCounter = 0 //used for naming images bassed on their uploaded Order

    async function onSubmit(rawData: form) {
        // console.log("raw Data:", rawData) 
        let finalData: CollectionData = {} as CollectionData
        const { templates, rawCover, ...data }: any = rawData
        try {
            if (templates && Object.keys(templates).length > 0) {
                const { fieldTemplates: { badges, links, ...fieldTemplates }, ...main } = templates
                data['templates'] = { fieldTemplates } //returns the rest of 'fieldTemplates' objects

                badges && (
                    data['templates']['fieldTemplates']['badges'] = await handleEditingLogosFields(badges, collectionData.templates?.fieldTemplates?.badges, orderCounter, collectionData.id, undefined)
                )

                links && (
                    data['templates']['fieldTemplates']['links'] = await handleEditingLogosFields(links, collectionData.templates?.fieldTemplates?.links, orderCounter, collectionData.id, undefined)
                )
            }

            if (rawCover && rawCover[0]) {
                orderCounter++
                const coverName = dateStamped(`${orderCounter.toString()}.${getFileExtension(rawCover[0].file.name)}`)
                handleImageUpload(rawCover, "collections", coverName);
                finalData['cover_path'] = coverName;
                //remove the image after uploading the new one
                if (collectionData.cover_path) deleteAPI('files', { fileNames: [`images/collections/${collectionData.cover_path}`] })
            } else if (rawCover === null) {
                //if null onle remove the cover
                deleteAPI('files', { fileNames: [`images/collections/${collectionData.cover_path}`] })
                finalData['cover_path'] = null
            }


            //filter unchanged value to avoid unneeded changes
            for (let key in data) {
                if (data.hasOwnProperty(key) && collectionData.hasOwnProperty(key)) {
                    if (data[key] != collectionData[key]) {
                        finalData[key] = data[key]
                    }
                }
            }

            await patchAPI(`collections/${collectionData.id}`, finalData)
            router.push(`/Collections/${collectionData.id}`)
            // console.log("Final Data:", finalData)    
        } catch (e) {
            console.log("(Collection) Error:", "Failed to Edit Collection", e)
        }
    }


    return Object.keys(collectionData).length > 0 ? (
        <>
            <form>

                <CollectionFormContext.Provider value={{ control, setValue, getValues, errors, collectionData, resetField, fieldTemplates }}>
                    <TitleBar
                        starShowerBlack
                        title={`Edit ${collectionData.title}`}
                        icon={
                            <BiSolidPencil className="text-[30px] mr-3 flex-none" />
                        }
                        withButtons>

                        <Button
                            onClick={handleSubmit(onSubmit)}
                            className="focus:outline-none bg-accented"
                            variant="solid"
                            type="button"
                        >
                            <FaSave className="text-xl" /> Save
                        </Button>

                        <Button
                            onClick={() => { router.push(`/Collections/${collectionData.id}`) }}
                            className="focus:outline-none bg-accented"
                            variant="solid"
                            type="button"
                        >
                            <BiX className="text-3xl" /> Cancel
                        </Button>

                    </TitleBar>

                    <>
                        <div className="grid grid-cols-4 gap-x-5 lg:grid-cols-3 animate-fade-in">
                            <SingleImageUploaderDefault
                                control={control}
                                fieldName="rawCover"
                                resetField={resetField}
                                setValue={setValue}
                                content="Cover"
                                imgSrc={collectionData.cover_path
                                    ? `${IMG_PATH}/images/collections/${collectionData.cover_path}`
                                    : undefined}
                            />
                            <CollectionMainInfoForm />
                        </div >

                        <TitleBar
                            title="Fields Templates"
                            className="bg-accented p-5 my-5"
                            icon={
                                <IoGridOutline className="text-[30px] mr-3 flex-none" />
                            }
                        >
                            <Tooltip
                                placement="left"
                                color="foreground"
                                content="Changing/Removing templates won't change/remove them inside any item. Items will remain untouched."
                            >
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    className="shadow-none"
                                >
                                    <BiInfoCircle className=" text-2xl" />
                                </Button>
                            </Tooltip>
                        </TitleBar>

                        <CollectionFormLowerLayout />

                    </>
                </CollectionFormContext.Provider>
            </form>
        </>
    )
        : <LoadingCollections /> //so the page won't load if there is no data
}
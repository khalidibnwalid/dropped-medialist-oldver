'use client'

import "dotenv/config";
import TitleBar from "@/components/bars/titlebar";
import SingleImageUploaderDefault from "@/components/forms/_components/Images/single-imageUploader-defaultValue";
import ListMainInfoForm from "@/components/forms/list/components/main-info";
import { ListFormLowerLayout } from "@/components/forms/list/layouts";
import { ListFormContext } from "@/components/forms/list/provider";
import { listData } from "@/types/list";
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
import LoadingLists from "../../loading";

type form = listData & { rawCover?: any }

export default function EditListPage({ params }: { params: { id: string } }) {

    const [listData, setListData] = useState<listData>({} as listData);
    const router = useRouter();

    const { handleSubmit, control, setValue, getValues, formState: { errors }, resetField } = useForm<form>();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData: listData = await fetchAPI(`lists/${params.id}`)
                setListData(fetchedData);
                setValue(`templates`, fetchedData?.templates) //to set templates
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchData();
    }, []);

    const fieldTemplates = listData.templates?.fieldTemplates

    let orderCounter = 0 //used for naming images bassed on their uploaded Order

    async function onSubmit(rawData: form) {
        // console.log("raw Data:", rawData) 
        let finalData: listData = {} as listData
        const { templates, rawCover, ...data }: any = rawData
        try {
            if (templates && Object.keys(templates).length > 0) {
                const { fieldTemplates: { badges, links, ...fieldTemplates }, ...main } = templates
                data['templates'] = { fieldTemplates } //returns the rest of 'fieldTemplates' objects

                badges && (
                    data['templates']['fieldTemplates']['badges'] = await handleEditingLogosFields(badges, listData.templates?.fieldTemplates?.badges, orderCounter, listData.id, undefined)
                )

                links && (
                    data['templates']['fieldTemplates']['links'] = await handleEditingLogosFields(links, listData.templates?.fieldTemplates?.links, orderCounter, listData.id, undefined)
                )
            }

            if (rawCover && rawCover[0]) {
                orderCounter++
                const coverName = dateStamped(`${orderCounter.toString()}.${getFileExtension(rawCover[0].file.name)}`)
                handleImageUpload(rawCover, "lists", coverName);
                finalData['cover_path'] = coverName;
                //remove the image after uploading the new one
                if (listData.cover_path) deleteAPI('files', { fileNames: [`images/lists/${listData.cover_path}`] })
            } else if (rawCover === null) {
                //if null onle remove the cover
                deleteAPI('files', { fileNames: [`images/lists/${listData.cover_path}`] })
                finalData['cover_path'] = null
            }


            //filter unchanged value to avoid unneeded changes
            for (let key in data) {
                if (data.hasOwnProperty(key) && listData.hasOwnProperty(key)) {
                    if (data[key] != listData[key as keyof typeof listData]) {
                        finalData[key] = data[key]
                    }
                }
            }

            await patchAPI(`lists/${listData.id}`, finalData)
            router.push(`/lists/${listData.id}`)
            // console.log("Final Data:", finalData)    
        } catch (e) {
            console.log("(list) Error:", "Failed to Edit Lists", e)
        }
    }


    return Object.keys(listData).length > 0 ? (
        <>
            <form>

                <ListFormContext.Provider value={{ control, setValue, getValues, errors, listData, resetField, fieldTemplates }}>
                    <TitleBar
                        starShowerBlack
                        title={`Edit ${listData.title}`}
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
                            onClick={() => { router.push(`/lists/${listData.id}`) }}
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
                                imgSrc={listData.cover_path
                                    ? `${process.env.PUBLIC_IMG_PATH}/images/lists/${listData.cover_path}`
                                    : undefined}
                            />
                            <ListMainInfoForm />
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

                        <ListFormLowerLayout />

                    </>
                </ListFormContext.Provider>
            </form>
        </>
    )
        : <LoadingLists /> //so the page won't load if there is no data
}
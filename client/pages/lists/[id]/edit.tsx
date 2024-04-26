import TitleBar from "@/components/bars/titlebar";
import ErrorPage from "@/components/errorPage";
import { UploadedImage } from "@/components/forms/_components/Images/single-imageUploader";
import SingleImageUploaderDefault from "@/components/forms/_components/Images/single-imageUploader-defaultValue";
import SubmitButtonWithIndicators from "@/components/forms/_components/SubmitWithIndicators";
import ListMainInfoForm from "@/components/forms/list/components/main-info";
import { ListFormLowerLayout } from "@/components/forms/list/layouts";
import { ListFormContext } from "@/components/forms/list/provider";
import LoadingLists from "@/components/pagesComponents/lists/listsloading";
import { listData } from "@/types/list";
import deleteAPI from "@/utils/api/deleteAPI";
import { handleEditingLogosFields } from "@/utils/api/handlers/handleEditingLogosFields";
import handleImageUpload from "@/utils/api/handlers/handleImageUpload";
import patchAPI from "@/utils/api/patchAPI";
import { dateStamped } from "@/utils/helperFunctions/dateStamped";
import getFileExtension from "@/utils/helperFunctions/getFileExtinsion";
import { mutateListCache } from "@/utils/query/cacheMutation";
import { listFetchOptions } from "@/utils/query/queryOptions/listsOptions";
import { Button, Tooltip } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { BiInfoCircle, BiSolidPencil, BiX } from "react-icons/bi";
import { IoGridOutline } from "react-icons/io5";
import { validate as uuidValidate } from 'uuid';

type form = listData & { rawCover?: UploadedImage }

export default function EditListPage() {
    const router = useRouter();
    const listId = router.query.id as string
    if (!uuidValidate(listId)) return <ErrorPage message="Bad List ID, Page Doesn't Exist" MainMessage="404!" />

    const { handleSubmit, control, setValue, getValues, formState: { errors }, resetField } = useForm<form>()

    const { data: listData, isSuccess, isPending, isError } = useQuery(listFetchOptions(listId))
    const [keyRefresher, setKeyRefresher] = useState(0)

    // would mess up with sortable lists if not used
    useEffect(() => {
        if (isSuccess) {
            setValue(`templates`, listData.templates)
            setKeyRefresher(n => n + 1)
        }
    }, [isSuccess, listData])

    const mutation = useMutation({
        mutationFn: (data: Partial<listData>) => patchAPI(`lists/${listId}`, data),
        onSuccess: (data) => {
            mutateListCache(data, "edit")
            router.push(`/lists/${data.id}`)
        },
    })

    if (isPending) return <LoadingLists />
    if (isError || !listData) return <ErrorPage message="Failed to Fetch List Data" />

    const fieldTemplates = listData.templates?.fieldTemplates
    let orderCounter = 0 //used for naming images bassed on their uploaded Order

    async function onSubmit(rawData: form) {
        // console.log("raw Data:", rawData) 
        if (!listData) return
        let finalData: Partial<listData> = {}
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
            Object.keys(data).forEach((key) => {
                if (data[key] != listData[key as keyof listData]) {
                    finalData[key as keyof listData] = data[key]
                }
            })

            mutation.mutate(finalData);
            // console.log("Final Data:", finalData)    
        } catch (e) {
            console.log("(list) Error:", "Failed to Edit Lists", e)
        }
    }

    return isSuccess && (
        <form key={keyRefresher}>
            <ListFormContext.Provider value={{ control, setValue, getValues, errors, listData, resetField, fieldTemplates }}>
                <TitleBar
                    starShowerBlack
                    title={`Edit ${listData.title}`}
                    startContent={<BiSolidPencil className="text-[30px] mr-3 flex-none" />}
                    withButtons
                >

                    <SubmitButtonWithIndicators
                        mutation={mutation}
                        onClick={handleSubmit(onSubmit)}
                    />

                    <Button
                        onClick={() => router.push(`/lists/${listData.id}`)}
                        className="focus:outline-none bg-accented"
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
                        startContent={<IoGridOutline className="text-[30px] mr-3 flex-none" />}
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
        </form >
    )
}
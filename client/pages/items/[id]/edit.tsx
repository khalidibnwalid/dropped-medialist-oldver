import ErrorPage from "@/components/errorPage";
import SingleImageUploaderDefault from '@/components/forms/_components/Images/single-imageUploader-defaultValue';
import SubmitButtonWithIndicators from "@/components/forms/_components/SubmitWithIndicators";
import { ItemFormCoverColumn, ItemFormPosterColumn } from "@/components/forms/item/layouts";
import { ItemForm, ItemFormContext } from "@/components/forms/item/provider";
import { authContext } from "@/components/pagesComponents/authProvider";
import ItemPageGallery from "@/components/pagesComponents/items/[id]/tabs/itempage-gallery";
import ItemPageLoading from "@/components/pagesComponents/items/itemPageLoading";
import type { itemData, itemTag } from '@/types/item';
import putAPI from "@/utils/api/putAPI";
import appendObjKeysToFormData from "@/utils/helperFunctions/form/appendObjKeysToFormData";
import handleEditFileForm from "@/utils/helperFunctions/form/handleEditFileForm";
import handleEditLogosFieldsForm from "@/utils/helperFunctions/form/handleEditLogosFieldsForm";
import { imagesFetchOptions } from "@/utils/query/imagesQueries";
import { itemFetchOptions, itemsFetchOptions, mutateItemCache } from "@/utils/query/itemsQueries";
import { listFetchOptions } from "@/utils/query/listsQueries";
import { mutateTagCache, tagsFetchOptions } from "@/utils/query/tagsQueries";
import { Button, Divider } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiX } from 'react-icons/bi';
import { FaSave } from 'react-icons/fa';
import { validate as uuidValidate } from 'uuid';

function EditItemPage() {
    const router = useRouter();
    const itemId = router.query.id as string

    const { handleSubmit, control, setValue, getValues, resetField, formState: { errors } } = useForm<ItemForm>();
    const [keyRefresher, setKeyRefresher] = useState(0)

    const { userData } = useContext(authContext)

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
        mutationFn: (data: FormData) => putAPI(`items/${itemId}`, data),
        onSuccess: ({ newTags, ...itemData }: itemData & { newTags: itemTag[] }) => {
            mutateItemCache(itemData, "edit")
            router.push(`../../items/${itemData.id}`)
            if (newTags) newTags.forEach((tag) => mutateTagCache(tag, "add"))
        },
    })

    useEffect(() => {
        if (isSuccess) {
            setValue("badges", item.data.badges)
            setValue("links", item.data.links)
            setValue("main_fields", item.data.main_fields)
            setValue("extra_fields", item.data.extra_fields)
            const tags = item.data?.tags?.map((id) => ({ value: id }))
            setValue("tags", tags || [])
            const related = item.data?.related?.map((id) => ({ value: id }))
            setValue("related", related || [])
            setValue("content_fields", item.data.content_fields)
            if (item.data?.poster_path) setValue(`poster_path`, item.data.poster_path)
            if (item.data?.cover_path) setValue(`cover_path`, item.data.cover_path)
            setKeyRefresher(n => n + 1)
        }
    }, [isSuccess])

    if (isPending) return <ItemPageLoading />
    if (isError) return <ErrorPage message="Failed to Fetch Item" />

    const listItemsData = listItems.data.filter((item) => item.id !== itemId) // for related items
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

        handleEditFileForm(cover_path, formData, 'cover_path')
        handleEditFileForm(poster_path, formData, 'poster_path')

        const badges = handleEditLogosFieldsForm(badgesData, formData, 'badges')
        const links = handleEditLogosFieldsForm(linksData, formData, 'links')

        formData.append('badges', JSON.stringify(badges))
        formData.append('links', JSON.stringify(links))

        mutation.mutate(formData)
    };

    return (
        <>
            <Head>
                <title>MediaList - Edit {item.data.title}</title>
            </Head>

            <ItemFormContext.Provider value={{
                control,
                fieldTemplates,
                setValue,
                getValues,
                errors,
                itemData: item.data,
                resetField
            }}>
                <form className="grid grid-cols-3 py-5 gap-x-7 items-start" key={keyRefresher}>

                    <div className="col-span-1 grid gap-y-2">
                        <SingleImageUploaderDefault
                            className='h-44'
                            control={control}
                            fieldName="poster_path"
                            resetField={resetField}
                            setValue={setValue}
                            content="Item's Poster"
                            imgSrc={item.data.poster_path
                                ? `${process.env.PUBLIC_IMG_PATH}/images/${userData.id}/${item.data.list_id}/${item.data.id}/${item.data.poster_path}`
                                : undefined}
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
                            fieldName="cover_path"
                            resetField={resetField}
                            setValue={setValue}
                            content="Item's Cover"
                            imgSrc={item.data.cover_path
                                ? `${process.env.PUBLIC_IMG_PATH}/images/${userData.id}/${item.data.list_id}/${item.data.id}/${item.data.cover_path}`
                                : undefined}
                        />
                        <Divider className="my-2" />
                        <ItemFormCoverColumn />
                        <Divider className="my-2" />
                        <ItemPageGallery imageArray={images.data} item={item.data} />
                    </div>

                </form>
            </ItemFormContext.Provider>
        </>
    )
}

export default function EditItemPageHOC() {
    const router = useRouter();
    const itemId = router.query.id as string
    return uuidValidate(itemId) ? <EditItemPage /> : <ErrorPage message="Bad Item ID, Page Doesn't Exist" MainMessage="404!" />
}
import TitleBar from "@/components/bars/titlebar";
import ErrorPage from "@/components/errorPage";
import SingleImageUploaderDefault from "@/components/forms/_components/Images/single-imageUploader-defaultValue";
import SubmitButtonWithIndicators from "@/components/forms/_components/SubmitWithIndicators";
import ListMainInfoForm from "@/components/forms/list/components/main-info";
import { ListFormLowerLayout } from "@/components/forms/list/layouts";
import { ListFormContext } from "@/components/forms/list/provider";
import { authContext } from "@/components/pagesComponents/authProvider";
import ListsLoading from "@/components/pagesComponents/lists/listsLoading";
import { fieldTemplates, listData, templates } from "@/types/list";
import putAPI from "@/utils/api/putAPI";
import appendObjKeysToFormData from "@/utils/helperFunctions/form/appendObjKeysToFormData";
import handleEditFileForm from "@/utils/helperFunctions/form/handleEditFileForm";
import handleEditLogosFieldsForm from "@/utils/helperFunctions/form/handleEditLogosFieldsForm";
import { listFetchOptions, mutateListCache } from "@/utils/query/listsQueries";
import { Button, Tooltip } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { BiInfoCircle, BiSolidPencil, BiX } from "react-icons/bi";
import { IoGridOutline } from "react-icons/io5";
import { validate as uuidValidate } from 'uuid';

function EditListPage() {
    const router = useRouter();
    const listId = router.query.id as string

    const { userData } = useContext(authContext)

    const { handleSubmit, control, setValue, getValues, formState: { errors }, resetField } = useForm<listData>()

    const { data: listData, isSuccess, isPending, isError } = useQuery(listFetchOptions(listId))
    const [keyRefresher, setKeyRefresher] = useState(0)

    // would mess up with sortable lists if not used
    useEffect(() => {
        if (isSuccess) {
            setValue(`templates`, listData.templates)
            if (listData?.cover_path) setValue(`cover_path`, listData.cover_path)
            setKeyRefresher(n => n + 1)
        }
    }, [isSuccess, listData])

    const mutation = useMutation({
        mutationFn: (formData: FormData) => putAPI(`lists/${listId}`, formData),
        onSuccess: (data) => {
            mutateListCache(data, "edit")
            router.push(`/lists/${data.id}`)
        },
    })

    if (isPending) return <ListsLoading />
    if (isError) return <ErrorPage message="Failed to Fetch List Data" />

    const fieldTemplates = listData.templates?.fieldTemplates

    async function onSubmit(rawData: listData) {
        const { templates, cover_path, ...data } = rawData
        if (!templates || !templates.fieldTemplates) return

        const { fieldTemplates: fieldTemplatesData, ...restTemplates } = templates as templates
        const { badges: badgesData, links: linksData, ...restFieldTemplates } = fieldTemplatesData as fieldTemplates

        const formData = new FormData();
        appendObjKeysToFormData(formData, data)

        handleEditFileForm(cover_path, formData, 'cover_path')

        const badges = handleEditLogosFieldsForm(badgesData, formData, 'badges')
        const links = handleEditLogosFieldsForm(linksData, formData, 'links')

        const fieldTemplates = { ...restFieldTemplates, badges, links }
        formData.append('templates', JSON.stringify({ ...restTemplates, fieldTemplates }))

        mutation.mutate(formData);
    }

    return isSuccess && (
        <>
            <Head>
                <title>MediaList - Edit {listData.title}</title>
            </Head>

            <form key={keyRefresher}>
                <ListFormContext.Provider value={{ control, setValue, getValues, errors, listData, resetField, fieldTemplates }}>
                    <TitleBar
                        pointedBg
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

                    <div className="grid grid-cols-4 gap-x-5 lg:grid-cols-3 animate-fade-in">
                        <SingleImageUploaderDefault
                            control={control}
                            fieldName="cover_path"
                            resetField={resetField}
                            setValue={setValue}
                            content="Cover"
                            imgSrc={listData.cover_path
                                ? `${process.env.PUBLIC_IMG_PATH}/images/${userData.id}/${listData.id}/${listData.cover_path}`
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

                </ListFormContext.Provider>
            </form >
        </>
    )
}

export default function EditListPageHOC() {
    const router = useRouter();
    const itemId = router.query.id as string
    return uuidValidate(itemId) ? <EditListPage /> : <ErrorPage message="Bad List ID, Page Doesn't Exist" MainMessage="404!" />
}
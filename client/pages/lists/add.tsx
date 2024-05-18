import TitleBar from "@/components/bars/titlebar";
import SingleImageUploader, { UploadedImage } from "@/components/forms/_components/Images/single-imageUploader";
import SubmitButtonWithIndicators from "@/components/forms/_components/SubmitWithIndicators";
import ListMainInfoForm from "@/components/forms/list/components/main-info";
import { ListFormLowerLayout } from "@/components/forms/list/layouts";
import { ListFormContext } from "@/components/forms/list/provider";
import type { fieldTemplates, listData, templates } from "@/types/list";
import postAPI from "@/utils/api/postAPI";
import appendObjKeysToFormData from "@/utils/helperFunctions/form/appendObjKeysToFormData";
import handleAddLogosFieldsForm from "@/utils/helperFunctions/form/handleAddLogosFieldsForm";
import { mutateListCache } from "@/utils/query/listsQueries";
import { Button, Tooltip } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { BiInfoCircle, BiPlus } from "react-icons/bi";
import { IoGridOutline } from "react-icons/io5";

export default function AddListPage() {
    const router = useRouter();
    const { handleSubmit, control, setValue, getValues, formState: { errors } } = useForm<listData>();

    const mutation = useMutation({
        mutationFn: (formData: FormData) => postAPI('lists', formData),
        onSuccess: (data) => {
            mutateListCache(data, "add")
            router.push(`/lists/${data.id}`)
        },
    })

    async function onSubmit(rawData: listData) {
        type omitData = Omit<listData, 'cover_path' | 'templates' | 'id'>;
        const { cover_path, templates, ...data } = rawData
        if (!templates || !templates?.fieldTemplates) return

        const { fieldTemplates: fieldTemplatesData, ...restTemplates } = templates as templates
        const { badges: badgesData, links: linksData, ...restFieldTemplates } = fieldTemplatesData as fieldTemplates

        const formData = new FormData();
        appendObjKeysToFormData(formData, data as omitData)

        formData.append('cover_path', ((cover_path as UploadedImage)?.[0]?.file ?? ''))

        const badges = handleAddLogosFieldsForm(badgesData, formData, 'badges')
        const links = handleAddLogosFieldsForm(linksData, formData, 'links')

        const fieldTemplates = { ...restFieldTemplates, badges, links }
        formData.append('templates', JSON.stringify({ ...restTemplates, fieldTemplates }))

        mutation.mutate(formData)
    }

    return (
        <>
        <Head>
            <title>MediaList - Add List</title>
        </Head>
            <form>
                <TitleBar
                    starShowerBlack
                    title="Add a List"
                    startContent={<BiPlus className="text-[30px] mr-3 flex-none" />}
                    withButtons
                >
                    <SubmitButtonWithIndicators
                        mutation={mutation}
                        onClick={handleSubmit(onSubmit)}
                    />
                </TitleBar>

                <ListFormContext.Provider value={{ control, setValue, getValues, errors }}>

                    <div className="grid grid-cols-4 gap-x-5 lg:grid-cols-3">
                        <SingleImageUploader control={control} fieldName="cover_path" className="aspect-1" content="Cover" />
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
                            content="You can access templates when creating an item (Optional)"
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
            </form>
        </>
    )
}
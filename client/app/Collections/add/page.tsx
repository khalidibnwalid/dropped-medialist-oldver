'use client'

import TitleBar from "@/components/bars/titlebar";
import { CollectionFormLowerLayout } from "@/components/forms/collection/layouts";
import CollectionMainInfoForm from "@/components/forms/collection/components/main-info";
import { CollectionFormContext } from "@/components/forms/collection/provider";
import SingleImageUploader from "@/components/forms/_components/Images/single-imageUploader";
import type { CollectionData } from "@/types/collection";
import type { itemBadgesType, itemlink } from "@/types/item";
import handleImageUpload from "@/utils/api/handlers/handleImageUpload";
import postAPI from "@/utils/api/postAPI";
import { dateStamped } from "@/utils/helper-functions/dateStamped";
import getFileExtension from "@/utils/helper-functions/getFileExtinsion";
import sanitizeObject from "@/utils/helper-functions/sanitizeObject";
import { Button, Tooltip } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { BiInfoCircle, BiPlus } from "react-icons/bi";
import { IoGridOutline } from "react-icons/io5";

export default function AddCollectionPage() {
    const router = useRouter();
    const { handleSubmit, control, setValue, getValues, formState: { errors } } = useForm<CollectionData>();


    let orderCounter = 0

    async function onSubmit(rawData: any) {
        console.log("rawData", rawData) //test
        const { templates: { fieldTemplates: { badges, links, ...fieldTemplates }, ...main }, rawCover, ...data }: any = rawData

        data['templates'] = { fieldTemplates } //returns the rest of 'fieldTemplates' objects

        const badgesArray = badges.map((badge: itemBadgesType) => {
            orderCounter++
            if (badge.logo_path === undefined) {
                return badge
            } else if (typeof (badge.logo_path) === 'object') {
                const logoName = dateStamped(`${orderCounter.toString()}.${getFileExtension(badge.logo_path[0].file.name)}`)
                handleImageUpload(badge.logo_path, "logos", logoName);
                badge.logo_path = logoName
                return badge
            }
        })

        data['templates']['fieldTemplates']['badges'] = badgesArray

        const linksArray = links.map((link: itemlink) => {
            orderCounter++
            if (link.logo_path === undefined) {
                return link
            } else if (typeof (link.logo_path) === 'object') {
                const logoName = dateStamped(`${orderCounter.toString()}.${getFileExtension(link.logo_path[0].file.name)}`)
                handleImageUpload(link.logo_path, "logos", logoName);
                link.logo_path = logoName
                return link
            }
        })
        data['templates']['fieldTemplates']['links'] = linksArray


        if (rawCover && rawCover[0]) {
            orderCounter++
            const coverName = dateStamped(`${orderCounter.toString()}.${getFileExtension(rawCover[0].file.name)}`)
            handleImageUpload(rawCover, "collections", coverName);
            data['cover_path'] = coverName;
        }

        //handle the upload of logos, remember that u can't just get {links, badges,} by deconstructing, cuz they are inside inside the template object
        // templates > fieldTemplates -> 1. badges 2. links
        //templates: { fieldTemplates: badges }, templates: { fieldTemplates: links },

        sanitizeObject(data)
        console.log("finalData", data) //test
        await postAPI('collections', data) //for testing
        router.push('/Collections') //for testing
    }

    //for pincode input hide

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TitleBar starShowerBlack
                    title="Add a Collection"
                    icon={
                        <BiPlus className="text-[30px] mr-3 flex-none" />
                    }
                    withButtons>
                    <Button
                        onClick={() => { router.refresh() }}
                        className="focus:outline-none bg-accented"
                        variant="solid"
                        type="submit"
                    >
                        <BiPlus className="text-xl" /> Save Collection
                    </Button>
                </TitleBar>

                <CollectionFormContext.Provider value={{ control, setValue, getValues, errors }}>

                    <div className="grid grid-cols-4 gap-x-5 lg:grid-cols-3">
                        <SingleImageUploader control={control} fieldName="rawCover" className="aspect-1" content="Cover" />
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

                    <CollectionFormLowerLayout />

                </CollectionFormContext.Provider>
            </form>

        </>
    )
}
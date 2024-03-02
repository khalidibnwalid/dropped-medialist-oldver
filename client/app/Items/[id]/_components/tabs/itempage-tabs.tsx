'use client'

import { IMG_PATH } from "@/app/page";
import ListCard from "@/components/cards/list-cards";
import { Accordion, AccordionItem, Tab, Tabs } from "@nextui-org/react";
import { useContext, useState } from 'react';
import { BiImages, BiRss, BiSelectMultiple, BiSolidNote } from "react-icons/bi";
import { itemViewContext } from "../item-layouts";
import ItemBadges from "../itempage-badges";
import ItemPageGallery from "./itempage-gallery";



function ItemPageTabs({className}: {className?: string}) {
    const { tagsData, itemData, imagesData, relatedItems } = useContext(itemViewContext)

    const defaultSelected = () => {
        if (itemData.content_fields && itemData.content_fields?.length > 0) {
            return "notes"
        } else if (imagesData && imagesData.length > 0) {
            return "gallery"
        } else if (itemData.related && itemData.related?.length > 0) {
            return "related"
        }
        return "notes"
    }
    const [selected, setSelected] = useState(defaultSelected);


    return (
        <div className={`flex-grow ${className}`} >

            <Tabs variant="light" size="md" selectedKey={selected} onSelectionChange={setSelected} >

                <Tab key="notes" title={
                    <div className="flex items-center space-x-2">
                        <BiSolidNote className=" text-xl" />
                        <span>Notes</span>
                    </div>}>

                    <Accordion variant="light">

                        {itemData?.content_fields ? itemData.content_fields.map((data, index) => (
                            <AccordionItem key={index} title={data.name}>
                                {data.body}
                            </AccordionItem>
                        )) : []}

                    </Accordion>

                </Tab>

                <Tab key="gallery" title={
                    <div className="flex items-center space-x-2">
                        <BiImages className=" text-xl" />
                        <span>Gallery</span>
                    </div>}>

                   <ItemPageGallery imageArray={imagesData} item={itemData} />

                </Tab>


                <Tab key="related" title={
                    <div className="flex items-center space-x-2">
                        <BiSelectMultiple className=" text-xl" />
                        <span>Related</span>
                    </div>}>

                    <div className="grid grid-cols-1 gap-y-3 p-2">
                        {relatedItems?.map((data) =>
                            <ListCard
                                key={data.title}
                                title={data.title}
                                image={`${IMG_PATH}/images/items/${data.poster_path}`}
                                discrip={data.description} link={`../Items/${data.id}`}
                                underTitle={<div className="flex gap-x-1">
                                    {data.badges && <ItemBadges badgesArray={data.badges} />
                                    }
                                </div>}

                            />)}


                    </div>
                </Tab>

                <Tab key="RSS" title={
                    <div className="flex items-center space-x-2">
                        <BiRss className=" text-xl" />
                        <span>RSS</span>
                    </div>}>
                    {/* rss object that contains "URL" and "followed" if followed it will be 
                    showed in RSS page and will be showed like favorite and badges as chip under the title */}
                    <div className="grid grid-cols-1 gap-y-3 p-2">


                    </div>
                </Tab>
            </Tabs>
        </div>
    )
}


export default ItemPageTabs;


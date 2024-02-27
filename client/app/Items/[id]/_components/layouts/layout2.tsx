'use client'
import EditDropDown from "@/components/buttons/editdropdown-button";
import { Button, Chip } from "@nextui-org/react";
import { useContext } from "react";
import { BiDotsVerticalRounded, BiSolidStar, BiSolidTrashAlt } from "react-icons/bi";
import ItemBadges from "../itempage-badges";
import { itemViewContext } from "../item-layouts";
import ItemPageTabs from "../tabs/itempage-tabs";
import ItemPoster from "../itempage-poster";
import ItemUpperFields from "../fields/itempage-upperfields";
import ItemLinks from "../fields/itempage-links";
import ItemTags from "../itempage-tags";
import ItemLowerFields from "../fields/itempage-lowerfields";


export default function ItemLayout2() {
    const { tagsData, itemData, imagesData, relatedItems, coverPath } = useContext(itemViewContext)

    return (
        <>
            <header
                className="justify-center rounded-2xl shadow-lg  bg-cover bg-center "
                style={{ backgroundImage: `url(${coverPath})` }}
            >

                {/* Top blur cover */}
                <div className={`${coverPath ? `pt-40 bg-opacity-20 ` : `bg-opacity-[0.85] px-10`}
                                rounded-t-inherit
                                 grid-cols-4 grid grid-flow-row-dense items-start 
                                 backdrop-blur-sm  bg-black 
                                 z-10 relative
                                 `}
                >
                    {coverPath && <div className="col-span-1 bottom-0 relative pr-3 pl-7 h-10 ">
                        <ItemPoster />

                        <div className="grid gap-y-2">
                            <ItemLinks />
                            <ItemUpperFields />
                            <ItemTags />
                            <ItemLowerFields />
                        </div>
                    </div>}
                    <div className={`flex  ${coverPath ? 'col-span-3 py-5' : 'col-span-full pt-7'} pl-3 pr-7 items-end gap-x-2`}>
                        <h1 className="flex-grow text-5xl font-extrabold capitalize drop-shadow-lg">{itemData.title}</h1>
                        <EditDropDown data={itemData} item>
                            <Button isIconOnly variant="flat" radius="full">
                                <BiDotsVerticalRounded />
                            </Button>
                        </EditDropDown>

                    </div>

                </div>

                {/* Over Cover */}
                <div className={` ${coverPath && `scale-[1.005]`}
                                 grid-cols-4 grid grid-flow-row-dense
                                 h-full px-10 pb-10 pt-5 
                                 rounded-b-inherit
                                 bg-pure-theme bg-opacity-[0.85]
                                 backdrop-blur-xl shadow-lg`}
                >
                    <div id="empty div">
                        {/*  grid-flow-row-dense*/}
                    </div>

                    <div className={coverPath ? "col-span-3" : 'col-span-full'}>
                        <div className="flex items-center gap-x-1 pb-2">
                            {itemData.trash &&
                                <Chip className=" p-2 font-black" variant="flat" color="danger" startContent={<BiSolidTrashAlt size={14} />} key="fav-chip-0632">In Trash</Chip>
                            }
                            {itemData.fav &&
                                <Chip className=" p-2 opacity-90" variant="flat" color="warning" startContent={<BiSolidStar size={14} />} key="fav-chip-0632">Stared</Chip>
                            }
                            {itemData.progress_state &&
                                <Chip className=" p-2 opacity-90" variant="flat" color={itemData.progress_state.color}>{itemData.progress_state.name}</Chip>
                            }
                            {itemData.badges && <ItemBadges badgesArray={itemData.badges} />}
                        </div>

                        <p className=" whitespace-pre-wrap">{itemData.description}</p>
                    </div>

                </div>
            </header>

            <div className=" p-5 grid grid-cols-4 items-start gap-x-5 grid-flow-row-dense">

                {coverPath ? <div id="empty div2">
                    {/*  grid-flow-row-dense*/}
                </div>
                    :
                    <div className="col-span-1 px-3 z-10">
                        <ItemPoster />
                        <div className="grid gap-y-2">
                            <ItemLinks />
                            <ItemUpperFields />
                            <ItemTags />
                            <ItemLowerFields />
                        </div>
                    </div>
                }

                <div className="col-span-3">


                    <div className="flex justify-center items-center w-full">
                        <ItemPageTabs />
                    </div>

                </div>
            </div>
        </>
    )
}

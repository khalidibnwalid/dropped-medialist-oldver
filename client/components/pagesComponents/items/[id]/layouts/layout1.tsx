import EditDropDown from "@/components/buttons/editdropdown-button";
import { Button, Chip } from "@nextui-org/react";
import { useContext } from "react";
import { BiDotsVerticalRounded, BiSolidStar, BiSolidTrashAlt } from "react-icons/bi";
import ItemBadges from "../itempage-badges";
import { itemViewContext } from "@/pages/items/[id]";
import ItemPageTabs from "../tabs/itempage-tabs";
import ItemPoster from "../itempage-poster";
import ItemUpperFields from "../fields/itempage-upperfields";
import ItemLinks from "../fields/itempage-links";
import ItemTags from "../itempage-tags";
import ItemLowerFields from "../fields/itempage-lowerfields";
import ItemDescription from "../item-description";


export default function ItemLayout1() {
    const { tagsData, itemData, imagesData, relatedItems, coverPath } = useContext(itemViewContext)

    return (
        <div className="grid grid-cols-5 lg:grid-cols-4 items-start gap-x-5">
            <div className="col-span-1 ">
                <ItemPoster />

                <div className="grid gap-y-2">
                    <ItemUpperFields />
                    <ItemLinks />
                    <ItemTags />
                    <ItemLowerFields />
                </div>
            </div>

            <div className="col-span-4 lg:col-span-3">
                <header
                    className="justify-center rounded-2xl shadow-lg  bg-cover bg-center "
                    style={{ backgroundImage: `url(${coverPath})` }}
                >

                    {/* Top blur cover */}
                    <div className={`${coverPath ? `pt-40 rounded-t-inherit` : `rounded-inherit`} backdrop-blur-sm  bg-pure-theme bg-opacity-20 `}>

                    </div>

                    {/* Over Cover */}
                    <div className={` ${coverPath ? `rounded-b-inherit ` : `rounded-inherit`}
                            h-full px-10 pb-10 pt-5 scale-[1.005]
                           bg-pure-theme bg-opacity-[0.85]
                            backdrop-blur-xl shadow-lg`}>
                        <div className="flex">
                            <h1 className="flex-grow text-5xl lg:text-4xl sm:text-2xl font-extrabold capitalize px-3 drop-shadow-lg">{itemData.title}</h1>
                            <EditDropDown data={itemData} item>
                                <Button isIconOnly variant="bordered" radius="full">
                                    <BiDotsVerticalRounded />
                                </Button>
                            </EditDropDown>

                        </div>

                        <div className="flex items-center gap-x-1 py-3">
                            {itemData.trash &&
                                <Chip className=" p-2 font-black" variant="flat" color="danger" startContent={<BiSolidTrashAlt size={14} />} >In Trash</Chip>
                            }
                            {itemData.fav &&
                                <Chip className=" p-2 opacity-90" variant="flat" color="warning" startContent={<BiSolidStar size={14} />} >Stared</Chip>
                            }
                            {itemData.progress_state &&
                                <Chip className=" p-2 opacity-90" variant="flat" color={itemData.progress_state.color}>{itemData.progress_state.name}</Chip>
                            }
                            {itemData.badges && <ItemBadges badgesArray={itemData.badges} />}
                        </div>

                        <ItemDescription description={itemData.description} />

                    </div>
                </header>

                <div className="flex justify-center items-center w-full py-5">
                    <ItemPageTabs className="px-5" />
                </div>

            </div>
        </div>
    )
}

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


export default function ItemLayout3() {
    const { tagsData, itemData, imagesData, relatedItems, coverPath } = useContext(itemViewContext)

    return (
        <>
            <header
                className="justify-center rounded-2xl shadow-lg bg-cover bg-center "
                style={{ backgroundImage: `url(${coverPath})` }}
            >
                <div
                    className={`${coverPath ? `pt-7 bg-opacity-25 grid-cols-4 lg:grid-cols-3 ` : `bg-opacity-[0.85] px-10`}
                                rounded-t-inherit grid  items-start backdrop-blur-sm  bg-pure-theme z-10 relative`}
                >
                    <ItemPoster className="bottom-0 relative pb-2 pr-3 pl-7" />

                    <div className={coverPath ? " col-span-3 lg:col-span-2" : 'col-span-full pl-3'}>

                        <div className={`flex py-3 pl-3 pr-7 items-end gap-x-2`}>
                            <h1 className="flex-grow text-5xl lg:text-4xl sm:text-2xl font-extrabold capitalize drop-shadow-lg">{itemData.title}</h1>
                            <EditDropDown data={itemData} item>
                                <Button isIconOnly variant="flat" radius="full">
                                    <BiDotsVerticalRounded />
                                </Button>
                            </EditDropDown>

                        </div>

                        <div className="flex items-center gap-x-1 pb-2 px-3">
                            {itemData.trash &&
                                <Chip className=" p-2 font-black opacity-70" variant="solid" color="danger" startContent={<BiSolidTrashAlt size={14} />}>In Trash</Chip>
                            }
                            {itemData.fav &&
                                <Chip className=" p-2 opacity-70" variant="solid" color="warning" startContent={<BiSolidStar size={14} />}>Stared</Chip>
                            }
                            {itemData.progress_state &&
                                <Chip className=" p-2 opacity-70" variant="solid" color={itemData.progress_state.color}>{itemData.progress_state.name}</Chip>
                            }
                            <ItemBadges/>
                        </div>

                        <ItemDescription
                            className="p-4 mr-5 ml-2 mb-2 rounded-2xl font-extrabold drop-shadow-lg bg-pure-theme/20"
                            description={itemData.description}
                        />
                    </div>
                </div>
            </header>

            <ItemLinks className="flex flex-row gap-x-2 my-3 overflow-x-auto" />

            <div className=" grid grid-cols-4 items-start gap-x-5 grid-flow-row-dense">

                <div className="col-span-1 z-10">
                    <div className="grid gap-y-2">
                        <ItemUpperFields />
                        <ItemTags />
                        <ItemLowerFields />
                    </div>
                </div>


                <div className="col-span-3">
                    <div className="flex justify-center items-center w-full">
                        <ItemPageTabs />
                    </div>
                </div>
            </div>
        </>
    )
}

'use client'

import EditDropDown from "@/components/buttons/editdropdown-button";
import { Button, Divider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { BiDotsVerticalRounded, BiLockOpenAlt, BiPlus, BiPurchaseTag, BiRevision, BiSolidStar, BiStar } from "react-icons/bi";
import { CiGrid2H } from "react-icons/ci";
import { FaDiamond } from "react-icons/fa6";
import { IoGridOutline } from "react-icons/io5";
import { LuDiamond } from "react-icons/lu";
import { TfiViewListAlt } from "react-icons/tfi";
import { collectionBodyContext } from "../provider";

function CollectionNavButtons() {

    const { viewMode, setViewMode, stateFilter, toggledState, favFilter, favState, collectionData } = useContext(collectionBodyContext)

    const router = useRouter();

    return (
        <ul className=" flex items-center gap-2 mt-2 mb-5 animate-fade-in">
            {collectionData.pincode && <Button isIconOnly size="sm" className="flex-none"><BiLockOpenAlt className=" text-xl" /></Button>}
            {collectionData.fav && <Button size="sm" color="default" isIconOnly ><BiSolidStar className="text-lg" /></Button>}

            {(collectionData.fav || collectionData.pincode) && <Divider orientation="vertical" className="h-5" />}
            <Button
                size="sm"
                className="bg-accented"
                variant="solid"
                type="button"
                onClick={() => router.push(`/Collections/${collectionData.id}/add`)}
            >
                <BiPlus className="text-lg" />New Item
            </Button>

            <Button
                size="sm"
                className="bg-accented"
                variant="solid"
                type="button"
                onClick={() => router.push(`/Collections/${collectionData.id}/tags`)} >
                <BiPurchaseTag className="text-lg" />Tags
            </Button>

            <Divider orientation="vertical" className="h-5" />

            {/* Sort by State Options */}
            <div className="flex items-center gap-2 flex-grow overflow-x-auto  ">
                {/* Sort by Fav */}
                <Button
                    size="sm"
                    onClick={favFilter}
                    color={favState ? 'warning' : 'default'}
                >
                    {favState ? <BiSolidStar className="text-lg" /> : <BiStar className="text-lg" />}
                </Button>
                {/* Sort by State */}

                {collectionData.templates?.fieldTemplates?.states?.map(state =>
                    <Button
                        key={`${state.name}-button`}
                        onPress={() => stateFilter(state.name)}
                        size="sm"
                        color={toggledState === state.name ? state.color : 'default'}
                        variant="solid"
                        type="button"
                        startContent={toggledState === state.name ? <FaDiamond className="text-md" /> : <LuDiamond className="text-md" />}
                    >
                        {state.name}
                    </Button>
                )}
            </div>


            <Divider orientation="vertical" className="h-5 ml-auto" />

            {/* Grid View Buttons */}
            <Button
                size="sm" variant="solid" type="button" isIconOnly
                color={viewMode === "list" ? "primary" : undefined}
                className={viewMode !== "list" ? "bg-accented " : undefined}
                onClick={() => setViewMode("list")}
            >
                <TfiViewListAlt className="text-sm" />
            </Button>

            <Button
                size="sm" variant="solid" type="button" isIconOnly
                color={viewMode === "cardslist" ? "primary" : undefined}
                className={viewMode !== "cardslist" ? "bg-accented" : undefined}
                onClick={() => setViewMode("cardslist")}
            >
                <CiGrid2H className="text-lg" />
            </Button>

            <Button
                size="sm" variant="solid" type="button" isIconOnly
                color={viewMode === "cards" ? "primary" : undefined}
                className={viewMode !== "cards" ? "bg-accented" : undefined}
                onClick={() => setViewMode("cards")}
            >
                <IoGridOutline className="text-lg" />
            </Button>

            <Divider orientation="vertical" className="h-5" />

            {/* Droplist - should be chaneged to a radio */}
            <EditDropDown data={collectionData} collection>
                <Button size="sm" className="bg-accented " variant="solid" type="button" isIconOnly >
                    <BiDotsVerticalRounded className="text-lg" />
                </Button>
            </EditDropDown>
            <Button
                size="sm" className="bg-accented" variant="solid" type="button" isIconOnly
                onPress={() => router.refresh()}
            >
                <BiRevision className="text-lg" />
            </Button>

        </ul>
    )
}

export default CollectionNavButtons;
'use Client'

import TitleBar from "@/components/bars/titlebar";
import { Skeleton } from "@nextui-org/react";
import { BiCollection, BiSearch } from "react-icons/bi";


export default function LoadingCollections() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <>
            <TitleBar
                icon={<>
                    <BiSearch className="text-3xl mr-3 flex-none" />
                    <Skeleton className=" w-96 h-10 backdrop-blur-3xl opacity-50 rounded-xl shadow-perfect-md" />
                </>}
                starShowerBlack>

                <Skeleton className="w-[250px] h-10 rounded-xl shadow-perfect-md" />
            </TitleBar>
        </>
    )
}
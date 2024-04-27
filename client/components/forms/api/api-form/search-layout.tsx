'use client'

import { Switch } from "@nextui-org/react";
import { useContext } from "react";
import { ItemApiTemplateContext } from "../provider";
import ItemApiSearchMainInfo from "./search-main-info";
import ItemApisearchQueries from "./searchquery-templates";

export default function ItemApiSearchLayout() {
    const { searchIsAllowed, setSearchIsAllowed } = useContext(ItemApiTemplateContext)

    return (
        <div className="col-span-2">
            <div className="flex justify-between items-center pt-1 pb-4">
                <p className="text-zinc-500 text-xl">Search</p>
                <Switch isSelected={searchIsAllowed} onValueChange={setSearchIsAllowed} />
            </div>
            <div className=" grid gap-y-3">
                <ItemApiSearchMainInfo />
                <ItemApisearchQueries />
            </div>
        </div>
    )
}
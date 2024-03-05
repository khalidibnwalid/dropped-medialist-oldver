import TitleBar from "@/components/bars/titlebar"
import { listData } from "@/types/list"
import type { itemTag } from "@/types/item"
import fetchAPI from "@/utils/api/fetchAPI"
import { unstable_noStore } from "next/cache"
import { BiPurchaseTag } from "react-icons/bi"
import { AddTag } from "./_components/addtag"
import TagsSearchBar from "./_components/search-bar"
import TagsPageBody from "./_components/tagspage-body"
import TagsPageProvider from "./provider"

export default async function ListTagsPage({ params }: { params: { id: string } }) {
    unstable_noStore
    let listData: listData = {} as listData
    let tagsData: itemTag[] = []
    try {
        listData = await fetchAPI(`lists/${params.id}`)
        tagsData = await fetchAPI(`tags/${params.id}`)
    } catch (e) {
        console.error(e);
        throw e
    } finally {
        if (Object.keys(listData).length == 0) throw new Error("List Doesn't Exist")
    }

    return (
        <TagsPageProvider listData={listData} allTags={tagsData} >
            <TitleBar
                title={`${listData.title} - Tags`}
                className="p-5 py-4 my-5 mb-0"
                icon={
                    <BiPurchaseTag className="text-3xl mr-3 flex-none" />
                }
                starShowerBlack
            >
                <TagsSearchBar />
            </TitleBar>

            <div className="pt-3 pb-10 grid grid-flow-row gap-y-3">
                <AddTag />
                <TagsPageBody />

            </div>
        </TagsPageProvider>
    )
}
import TitleBar from "@/components/bars/titlebar"
import ErrorPage from "@/components/errorPage"
import LoadingLists from "@/components/pagesComponents/lists/listsloading"
import { AddTag } from "@/components/pagesComponents/lists/tags/addtag"
import TagsPageProvider from "@/components/pagesComponents/lists/tags/provider"
import TagsSearchBar from "@/components/pagesComponents/lists/tags/search-bar"
import TagsPageBody from "@/components/pagesComponents/lists/tags/tagspage-body"
import { listFetchOptions } from "@/utils/query/queryOptions/listsOptions"
import { tagsFetchOptions } from "@/utils/query/queryOptions/tagsOptions"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { BiPurchaseTag } from "react-icons/bi"
import { validate as uuidValidate } from 'uuid'

function ListPageTags() {
    const router = useRouter()
    const listId = router.query.id as string

    const list = useQuery(listFetchOptions(listId))
    const tags = useQuery(tagsFetchOptions(listId))

    const isPending = list.isLoading || tags.isLoading
    const isError = list.isError || tags.isError
    const isSuccess = list.isSuccess && tags.isSuccess

    if (isPending) return <LoadingLists />
    if (isError) return <ErrorPage message="Failed to Fetch Items" />

    return isSuccess && (
        <TagsPageProvider listData={list.data} allTags={tags.data} >
            <TitleBar
                title={`${list.data.title} - Tags`}
                className="p-5 py-4 my-5 mb-0"
                startContent={<BiPurchaseTag className="text-3xl mr-3 flex-none" />}
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

export default function ListPageTagsHOC() {
    const router = useRouter();
    const itemId = router.query.id as string
    return uuidValidate(itemId) ? <ListPageTags /> : <ErrorPage message="Bad List ID, Page Doesn't Exist" MainMessage="404!" />
  }
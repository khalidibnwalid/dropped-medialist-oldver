import TitleBar from "@/components/bars/titlebar";
import ErrorPage from "@/components/errorPage";
import ListAdvancedSearch from "@/components/pagesComponents/lists/[id]/advancedSearch";
import ListDisplayedItems from "@/components/pagesComponents/lists/[id]/displayedItems";
import ListNavButtons from "@/components/pagesComponents/lists/[id]/navButtons";
import ListBodyProvider from "@/components/pagesComponents/lists/[id]/provider";
import ListSearchBar from "@/components/pagesComponents/lists/[id]/searchBar";
import LoadingLists from "@/components/pagesComponents/lists/listsloading";
import { itemsFetchOptions } from "@/utils/query/queryOptions/itemsOptions";
import { listFetchOptions } from "@/utils/query/queryOptions/listsOptions";
import { tagsFetchOptions } from "@/utils/query/queryOptions/tagsOptions";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'next/router';
import { BiCollection } from "react-icons/bi";
import { validate as uuidValidate } from 'uuid';

function ListPage() {
  const router = useRouter()
  const listId = router.query.id as string

  const list = useQuery(listFetchOptions(listId))
  const items = useQuery(itemsFetchOptions(listId))
  const tags = useQuery(tagsFetchOptions(listId))

  const isPending = (list.isPending || items.isPending || tags.isPending)
  const isError = (list.isError || items.isError || tags.isError)

  if (isPending) return <LoadingLists />
  if (isError) return <ErrorPage message="Failed to Fetch Items" />

  // only load after items data is available
  return (
    <ListBodyProvider listData={list.data} allItems={items.data} tags={tags.data}>
      <TitleBar
        title={`${list.data.title} (${items.data?.length || 0})`}
        className="p-5 py-4 my-5 mb-0"
        icon={
          <BiCollection className="text-3xl mr-3 flex-none p-0" />
        }
        starShowerBlack
      >
        <ListSearchBar />
      </TitleBar>
      <ListAdvancedSearch />
      <ListNavButtons />

      <ListDisplayedItems />
    </ListBodyProvider>
  )
}

export default function ListPageHOC() {
  const router = useRouter();
  const itemId = router.query.id as string
  return uuidValidate(itemId) ? <ListPage /> : <ErrorPage message="Bad List ID, Page Doesn't Exist" MainMessage="404!" />
}
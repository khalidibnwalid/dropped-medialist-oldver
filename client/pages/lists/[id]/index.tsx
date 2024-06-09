import TitleBar from "@/components/bars/titlebar";
import ErrorPage from "@/components/errorPage";
import ListAdvancedSearch from "@/components/pagesComponents/lists/[id]/advancedSearch";
import ListDisplayedItems from "@/components/pagesComponents/lists/[id]/displayedItems";
import ListNavButtons from "@/components/pagesComponents/lists/[id]/navButtons";
import ListBodyProvider from "@/components/pagesComponents/lists/[id]/provider";
import ListSearchBar from "@/components/pagesComponents/lists/[id]/searchBar";
import ListsLoading from "@/components/pagesComponents/lists/listsLoading";
import { itemsFetchOptions } from "@/utils/query/itemsQueries";
import { listFetchOptions } from "@/utils/query/listsQueries";
import { tagsFetchOptions } from "@/utils/query/tagsQueries";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
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

  if (isPending) return <ListsLoading />
  if (isError) return <ErrorPage message="Failed to Fetch Items" />

  // only load after items data is available
  return (
    <>
      <Head>
        <title>MediaList - {list.data.title}</title>
      </Head>

      <ListBodyProvider listData={list.data} allItems={items.data} tags={tags.data}>
        <TitleBar
          title={`${list.data.title} (${items.data?.length || 0})`}
          className="p-5 py-4 my-5 mb-0"
          startContent={<BiCollection className="text-3xl mr-3 flex-none p-0" />}
          pointedBg
        >
          <ListSearchBar />
        </TitleBar>
        <ListAdvancedSearch />
        <ListNavButtons />

        <ListDisplayedItems />
      </ListBodyProvider>
    </>
  )
}

export default function ListPageHOC() {
  const router = useRouter();
  const itemId = router.query.id as string
  return uuidValidate(itemId) ? <ListPage /> : <ErrorPage message="Bad List ID, Page Doesn't Exist" MainMessage="404!" />
}
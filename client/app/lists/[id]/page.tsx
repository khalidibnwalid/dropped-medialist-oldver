import TitleBar from "@/components/bars/titlebar";
import { itemData, itemTag } from "@/types/item";
import type { listData } from "@/types/list";
import serverFetchAPI from "@/utils/api/serverFetchAPI";
import { unstable_noStore } from "next/cache";
import { BiCollection } from "react-icons/bi";
import ListAdvancedSearch from "./_components/advanced-search";
import ListDisplayedItems from "./_components/displayed-items";
import ListNavButtons from "./_components/navbuttons";
import ListSearchBar from "./_components/search-bar";
import ListBodyProvider from "./provider";

// import type { Metadata } from 'next'

// let title = ''; // to share title between Page and metaData

// export async function generateMetadata() {
//   return {
//     title: title,
//   }
// }

async function Listpage({ params }: { params: { id: string } }) {
  unstable_noStore
  let data = {} as listData
  try {
    data = await serverFetchAPI(`lists/${params.id}`)
  } catch (e) {
    console.error(e);
    throw e
  } finally {
    if (Object.keys(data).length == 0) throw new Error("list Doesn't Exist")
  }
  const items: itemData[] = await serverFetchAPI(`items/${params.id}?trash=false`)
  const tags: itemTag[] = await serverFetchAPI(`tags/${params.id}`)

  const NumberOfItems = items.length;

  return (
    <ListBodyProvider listData={data} allItems={items} tags={tags}>
      <TitleBar
        title={`${data.title} (${NumberOfItems})`}
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

export default Listpage;
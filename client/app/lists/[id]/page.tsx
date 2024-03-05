import TitleBar from "@/components/bars/titlebar";
import type { listData } from "@/types/list";
import fetchAPI from "@/utils/api/fetchAPI";
import { unstable_noStore } from "next/cache";
import { BiCollection } from "react-icons/bi";
import ListDisplayedItems from "./_components/displayed-items";
import { itemData, itemTag } from "@/types/item";
import ListBodyProvider from "./provider";
import ListNavButtons from "./_components/navbuttons";
import ListSearchBar from "./_components/search-bar";
import ListAdvancedSearch from "./_components/advanced-search";

// import type { Metadata } from 'next'

// let title = ''; // to share title between Page and metaData

// export async function generateMetadata() {
//   return {
//     title: title,
//   }
// }


async function Listpage({ params }: { params: { id: string } }) {
  unstable_noStore
  let data: listData = {} as listData
  try {
    data = await fetchAPI(`lists/${params.id}`)
  } catch (e) {
    console.error(e);
    throw e
  } finally {
    if (Object.keys(data).length == 0) throw new Error("list Doesn't Exist")
  }
  const items: itemData[] = await fetchAPI(`items/${params.id}`)
  const tags: itemTag[] = await fetchAPI(`tags/${params.id}`)

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
import TitleBar from "@/components/bars/titlebar";
import type { CollectionData } from "@/types/collection";
import fetchAPI from "@/utils/api/fetchAPI";
import { unstable_noStore } from "next/cache";
import { BiCollection } from "react-icons/bi";
import CollectionDisplayedItems from "./_components/displayed-items";
import { itemData, itemTag } from "@/types/item";
import CollectionBodyProvider from "./provider";
import CollectionNavButtons from "./_components/navbuttons";
import CollectionSearchBar from "./_components/search-bar";
import CollectionAdvancedSearch from "./_components/advanced-search";

// import type { Metadata } from 'next'

// let title = ''; // to share title between Page and metaData

// export async function generateMetadata() {
//   return {
//     title: title,
//   }
// }


async function Collection_page({ params }: { params: { id: string } }) {
  unstable_noStore
  let data: CollectionData = {} as CollectionData
  try {
    data = await fetchAPI(`collections/${params.id}`)
  } catch (e) {
    console.error(e);
    throw e
  } finally {
    if (Object.keys(data).length == 0) throw new Error("Collection Doesn't Exist")
  }
  const items: itemData[] = await fetchAPI(`items/${params.id}`)
  const tags: itemTag[] = await fetchAPI(`tags/${params.id}`)

  const NumberOfItems = items.length;

  return (
    <CollectionBodyProvider collectionData={data} allItems={items} tags={tags}>
      <TitleBar
        title={`${data.title} (${NumberOfItems})`}
        className="p-5 py-4 my-5 mb-0"
        icon={
          <BiCollection className="text-3xl mr-3 flex-none p-0" />
        }
        starShowerBlack
      >
        <CollectionSearchBar />
      </TitleBar>

      <CollectionAdvancedSearch />

      <CollectionNavButtons />
      <CollectionDisplayedItems />

    </CollectionBodyProvider>
  )
}

export default Collection_page;
import TitleBar from "@/components/bars/titlebar";
import type { CollectionData } from "@/types/collection";
import fetchAPI from "@/utils/api/fetchAPI";
import { unstable_noStore } from "next/cache";
import { BiCollection } from "react-icons/bi";
import CollectionBody from "./_components/collection-body";

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
  const items = await fetchAPI(`items/${params.id}`)

  const itemsNumber = items.reduce((a: number, _: any) => (a + 1), 0);


  return (
    <>
      <TitleBar
        title={`${data.title} (${itemsNumber})`}
        icon={
          <BiCollection className="text-3xl mr-3 flex-none" />
        }
        underBar
        starShowerBlack
      >
        {/* <SearchBar searchText="Search an Item" /> */}
      </TitleBar>

      {/* CollectionBody = subNav + items listing */}
      <CollectionBody data={data} items={items} />

    </>
  )
}

export default Collection_page;
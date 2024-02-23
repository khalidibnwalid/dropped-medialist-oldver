import CollectionCards from '@/app/Collections/_components/collection-cards';
import fetchAPI from '@/utils/api/fetchAPI';
import { revalidatePath, unstable_noStore } from 'next/cache';
//import collectionDataTest from "@/test/collections-test"; //test data
import ButAddCollection from '@/app/Collections/_components/addcollection-button';
import TitleBar from '@/components/bars/titlebar';
import "dotenv/config";
import type { Metadata } from 'next';
import { BiCollection } from "react-icons/bi";
import RefreshButton from './_components/refresh-button';

export const metadata:Metadata = {
  title: 'Collections',
}

async function Collection_view() {
  unstable_noStore
  // const data = collectionDataTest(); //testing data
  const data = await fetchAPI('collections') //real data
  revalidatePath('/Collections');// to avoid old cashe // not working
  return (
    <>
      <TitleBar starShowerBlack
        title="Collections"
        icon={<BiCollection className="text-[30px] mr-3 flex-none" />}
        withButtons>
        <RefreshButton />
        <ButAddCollection />
      </TitleBar>

      <main className="">
        <CollectionCards dataArray={data} />

      </main>
    </>

  )
}

export default Collection_view;

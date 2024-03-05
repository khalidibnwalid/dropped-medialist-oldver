import ListCards from '@/app/lists/_components/lists-cards';
import fetchAPI from '@/utils/api/fetchAPI';
import { revalidatePath, unstable_noStore } from 'next/cache';
import AddListButton from '@/app/lists/_components/addlist-button';
import TitleBar from '@/components/bars/titlebar';
import "dotenv/config";
import type { Metadata } from 'next';
import { BiCollection } from "react-icons/bi";
import RefreshButton from './_components/refresh-button';

export const metadata: Metadata = {
  title: 'Lists',
}

async function AllLists() {
  unstable_noStore
  const data = await fetchAPI('lists') //real data
  revalidatePath('/lists');// to avoid old cashe // not working
  return (
    <>
      <TitleBar
        starShowerBlack
        title="Lists"
        icon={<BiCollection className="text-[30px] mr-3 flex-none "/>}
        withButtons
      >
        <RefreshButton />
        <AddListButton />
      </TitleBar>

      <main className="">
        <ListCards dataArray={data} />

      </main>
    </>

  )
}

export default AllLists;

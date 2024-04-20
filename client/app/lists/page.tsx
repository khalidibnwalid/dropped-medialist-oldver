import AddListButton from '@/app/lists/_components/addlist-button';
import ListCards from '@/app/lists/_components/lists-cards';
import TitleBar from '@/components/bars/titlebar';
import serverFetchAPI from '@/utils/api/serverFetchAPI';
import type { Metadata } from 'next';
import { revalidatePath, unstable_noStore } from 'next/cache';
import { BiCollection } from "react-icons/bi";
import RefreshButton from './_components/refresh-button';

export const metadata: Metadata = {
  title: 'Lists',
}

async function AllLists() {
  unstable_noStore
  const data = await serverFetchAPI('lists?trash=false') //real data
  revalidatePath('/lists');// to avoid old cashe // not working
  return (
    <>
      <TitleBar
        starShowerBlack
        title="Lists"
        icon={<BiCollection className="text-[30px] mr-3 flex-none " />}
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

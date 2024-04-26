import TitleBar from '@/components/bars/titlebar';
import ErrorPage from '@/components/errorPage';
import ListCards from '@/components/pagesComponents/lists/listsCards';
import LoadingLists from '@/components/pagesComponents/lists/listsloading';
import { allListsKey, listsFetchOptions } from '@/utils/query/listsOptions';
import { Button, ButtonProps } from '@nextui-org/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { BiCollection, BiPlus, BiRevision } from "react-icons/bi";

export default function AllLists() {
  const { isPending, data, isError } = useQuery(listsFetchOptions())
  if (isError || !data) return <ErrorPage message="Failed to Fetch Lists" />
  if (isPending) return <LoadingLists />

  return (
    <>
      <TitleBar
        starShowerBlack
        title="Lists"
        startContent={<BiCollection className="text-[30px] mr-3 flex-none " />}
        withButtons
      >
        <ListButtons />
      </TitleBar>

      <main className="">
        <ListCards dataArray={data} />
      </main>
    </>
  )
}

function ListButtons() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const refetchLists = () => queryClient.invalidateQueries({ queryKey: allListsKey })

  const props: ButtonProps = {
    className: "focus:outline-none bg-accented",
    variant: "solid",
    type: "button"
  }
  return (
    <>
      <Button
        onPress={refetchLists}
        {...props}
      >
        <BiRevision className="text-base" /> Refresh
      </Button>

      <Button
        onPress={() => router.push('/lists/add')}
        {...props}
      >
        <BiPlus className="text-xl" /> Add
      </Button>
    </>
  )
}
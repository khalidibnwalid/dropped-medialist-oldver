import ErrorPage from "@/components/errorPage"
import { queryClient } from "@/components/pagesComponents/providers"
import LoadingTrashPage from "@/components/pagesComponents/trash/loading"
import TrashSide from "@/components/pagesComponents/trash/side"
import { itemData } from "@/types/item"
import { listData } from "@/types/list"
import deleteAPI from "@/utils/api/deleteAPI"
import fetchAPI from "@/utils/api/fetchAPI"
import patchAPI from "@/utils/api/patchAPI"
import { mutateItemCache, trashItemsKey } from "@/utils/query/itemsQueries"
import { mutateListCache, trashListsKey } from "@/utils/query/listsQueries"
import { useMutation, useQuery } from "@tanstack/react-query"
import Head from "next/head"

export default function TrashPage() {
    // trashPage won't use cache, since it's not a frequently visited page
    const trashItems = useQuery({
        queryKey: trashItemsKey,
        queryFn: () => fetchAPI('items?trash=true'),
        staleTime: 1000 * 10, // 10 second
    })

    const trashLists = useQuery({
        queryKey: trashListsKey,
        queryFn: () => fetchAPI('lists?trash=true'),
        staleTime: 1000 * 10, // 10 second
    })

    type itemIDS = itemData['id'][]
    type listIDS = listData['id'][]

    const deleteItems = useMutation({
        mutationFn: (IDs: itemIDS) => deleteAPI('items', { body: IDs }),
        onSuccess: ({ IDs }: { IDs: itemIDS }) => {
            IDs.forEach(id => queryClient.removeQueries({ queryKey: ['item', id] }))
            trashItems.refetch()
            deleteItems.reset()
        },
    })

    const deleteLists = useMutation({
        mutationFn: (IDs: listIDS) => deleteAPI('lists', { body: IDs }),
        onSuccess: ({ IDs }: { IDs: listIDS }) => {
            IDs.forEach(id => queryClient.removeQueries({ queryKey: ['list', id] }))
            trashLists.refetch()
            deleteLists.reset()
            trashItems.refetch() // user might have deleted items of the list, on list deletion they are deleted
        },
    })

    const restoreItems = useMutation({
        mutationFn: (IDs: itemIDS) => patchAPI('items/group', { id: IDs, trash: false }),
        onSuccess: (items: itemData[]) => {
            items.forEach((item) => mutateItemCache(item, 'add'))
            trashItems.refetch()
            restoreItems.reset()
        },
    })

    const restoreLists = useMutation({
        mutationFn: (IDs: listIDS) => patchAPI('lists/group', { id: IDs, trash: false }),
        onSuccess: (lists: listData[]) => {
            lists.forEach((list) => mutateListCache(list, 'add'))
            trashLists.refetch()
            restoreLists.reset()
        },
    })

    if (trashLists.isPending || trashItems.isPending) return <LoadingTrashPage />
    if (trashItems.isError || !trashItems.data) return <ErrorPage message="Failed to Fetch Trash" />

    return (
        <>
            <Head>
                <title>MediaList - Trash</title>
            </Head>

            <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-5 px-2 py-5 ">
                <TrashSide
                    clearTrashMt={deleteItems}
                    restoreTrashMt={restoreItems}
                    dataArray={trashItems.data}
                    item
                />
                <TrashSide
                    clearTrashMt={deleteLists}
                    restoreTrashMt={restoreLists}
                    dataArray={trashLists.data}
                />
            </div>
        </>
    )
}


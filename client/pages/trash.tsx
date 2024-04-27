import fetchAPI from "@/utils/api/fetchAPI"
import TrashSide from "@/components/pagesComponents/trash/side"
import { useQuery } from "@tanstack/react-query"
import { trashListsKey } from "@/utils/query/queryOptions/listsOptions"
import { trashItemsKey } from "@/utils/query/queryOptions/itemsOptions"
import ErrorPage from "@/components/errorPage"
import LoadingTrashPage from "@/components/pagesComponents/trash/loading"

export default function TrashPage() {

    const items = useQuery({
        queryKey: trashItemsKey,
        queryFn: async () => await fetchAPI('items?trash=true'),
        staleTime: 1000,  // 1 second

    })

    const lists = useQuery({
        queryKey: trashListsKey,
        queryFn: async () => await fetchAPI('lists?trash=true'),
        staleTime: 1000, // 1 second
    })

    if (lists.isPending || items.isPending) return <LoadingTrashPage />
    if (items.isError || !items.data) return <ErrorPage message="Failed to Fetch Trash" />

    return (
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-5 px-2 py-5 ">
            <TrashSide dataArray={items.data} item />
            <TrashSide dataArray={lists.data} />
        </div>
    )
}


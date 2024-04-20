import serverFetchAPI from "@/utils/api/serverFetchAPI"
import { revalidatePath, unstable_noStore } from "next/cache"
import TrashSide from "./_components/side"

export default async function TrashPage() {
    unstable_noStore
    const itemData = await serverFetchAPI('items?trash=true')
    const listData = await serverFetchAPI('lists?trash=true')

    revalidatePath('/Trash', 'page');// to avoid old cashe

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-5 px-2 py-5 ">
                <div>
                    <TrashSide dataArray={itemData} item />
                </div>
                <div>
                    <TrashSide dataArray={listData} />
                </div>
            </div>
        </>
    )
}


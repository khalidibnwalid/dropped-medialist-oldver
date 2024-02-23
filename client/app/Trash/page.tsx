import fetchAPI from "@/utils/api/fetchAPI"
import TrashItems from "./_components/trash-items"
import TrashCollections from "./_components/trash-collections"
import { revalidatePath, unstable_noStore } from "next/cache"

export default async function TrashPage() {
    unstable_noStore
    const itemData = await fetchAPI('items/rule/and?trash=true')
    const collectionData = await fetchAPI('collections/rule/and?trash=true')

    revalidatePath('/Trash', 'page');// to avoid old cashe // not working

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-5 px-2 py-5 ">
                <div>
                    <TrashItems dataArray={itemData} />
                </div>
                <div>
                    <TrashCollections dataArray={collectionData} />
                </div>
            </div>
        </>
    )
}


import type { itemData, itemTag } from "@/types/item";
import fetchAPI from "@/utils/api/fetchAPI";
import { unstable_noStore } from "next/cache";
import ItemLayouts from "./_components/item-layouts";

export default async function ItemsPage({ params }: { params: { id: string } }) {
    unstable_noStore
    let data: itemData = {} as itemData
    let dataImages = []
    let unfilteredTagsData: itemTag[] = []

    try {
        data = await fetchAPI(`items/id/${params.id}`);
        dataImages = await fetchAPI(`images/${params.id}`);
        unfilteredTagsData = await fetchAPI(`tags/${data.list_id}`)
    } catch (e) {
        console.error(e);
        throw e
    } finally {
        if (Object.keys(data).length == 0) throw new Error("Item Doesn't Exist")
    }

    // we import the database of tags then check if the id of the tag you have == the one in the database and ignore the rest.
    let tagsData: itemTag[] = []

    if (unfilteredTagsData.length > 0 && data.tags) {
        tagsData = data.tags.map((id) => unfilteredTagsData.find((tag) => tag.id == id && tag !== undefined)).filter(Boolean) as itemTag[];
        // in Typescript:
        //the mapped ".find" method returns an undefined when it doesn't find a value,
        //so we filter it out using .filter(Boolean) that removes falsy values to avoid typescript errors
    }

    //  build url query to fetch the info of related items
    const queryRelated = data.related && data.related?.length !== 0 && data.related?.reduce((acc: string, current: string) => (acc + "&id=" + current), `id=${data.related.shift()}`) || undefined
    const dataOfRelatedItems = data?.related && queryRelated && await fetchAPI(`items/group/or?${queryRelated}`) || [];

    return (
        <>
            <div className="py-5 animate-fade-in">
                <ItemLayouts imagesData={dataImages} itemData={data} tagsData={tagsData} relatedItems={dataOfRelatedItems} />
            </div>

        </>
    )
}

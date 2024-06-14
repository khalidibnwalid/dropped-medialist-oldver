import { listApiType, listApiWithSearchType } from "@/types/list";
import { Listbox, ListboxItem, Spinner } from "@nextui-org/react";
import { Dispatch, SetStateAction, Suspense, useContext } from "react";
import { ItemApiLoaderContext } from "./provider";

export default function ItemAPIModalPageOne({
    pageNumber,
    onClose,
    selectedRoutesArray,
    setIsLoading,
}: {
    pageNumber: number;
    onClose: () => void;
    selectedRoutesArray: string[];
    setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
    const { usedAPITemplate, loadAPITemplate, searchResults, apiDataValuesPicker } = useContext(ItemApiLoaderContext);

    function pickedTitle(result: object) {
        const title = apiDataValuesPicker({ title: (usedAPITemplate as listApiWithSearchType).searchTitlePath }, result)
        return title.title
    }

    function pickedResultToItemPath(result: object) {
        const path = apiDataValuesPicker({ path: (usedAPITemplate as listApiWithSearchType).searchResultToItem.path }, result)
        return path.path
    }

    return (pageNumber === 1) && (
        <div className="-mx-4 -my-2 animate-fade-in">
            <Suspense fallback={<Spinner label="Loading..." />}>
                <Listbox
                    aria-label="Api Search Results"
                    className="bg-accented rounded-lg overflow-y-auto"
                    onAction={async (key) => {
                        setIsLoading(true)
                        let route = selectedRoutesArray.join('')

                        const finalRouteAndQuery = route
                            + ((usedAPITemplate as listApiWithSearchType)?.searchResultToItem?.query || '/')
                            + key

                        await loadAPITemplate(usedAPITemplate as listApiType, finalRouteAndQuery)
                        setIsLoading(false)
                        onClose()
                    }}
                >
                    {searchResults.search.map((result: object) => (
                        <ListboxItem
                            color="primary"
                            key={pickedResultToItemPath(result)}
                            textValue={pickedTitle(result)}
                        >
                            {pickedTitle(result)}
                        </ListboxItem>
                    ))}
                </Listbox>
            </Suspense>
        </div>);
}

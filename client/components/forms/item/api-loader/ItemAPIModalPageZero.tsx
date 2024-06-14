import { listApiWithSearchType } from "@/types/list";
import { Divider, Listbox, ListboxItem } from "@nextui-org/react";
import { Dispatch, SetStateAction, useContext } from "react";
import { ItemDirectAPILoaders } from "./ItemDirectAPILoaders";
import { ItemSearchAPILoaders } from "./ItemSearchAPILoaders";
import { ItemApiLoaderContext } from "./provider";

export default function ItemAPIModalPageZero({
    pageNumber,
    setPageNumber,
    onClose,
    selectedRoutesArray,
    setIsLoading,
    setError,
    selectedRoutes,
    setSelectedRoutes
}: {
    pageNumber: number;
    setPageNumber: Dispatch<SetStateAction<number>>;
    onClose: () => void;
    selectedRoutesArray: string[];
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<string | null>>;
    selectedRoutes: Set<string>;
    setSelectedRoutes: Dispatch<SetStateAction<Set<string>>>;
}) {
    const { usedAPITemplate } = useContext(ItemApiLoaderContext);

    return (pageNumber === 0) && (
        <>
            {(usedAPITemplate as listApiWithSearchType)?.routes?.length !== 0 && (
                <>
                    <p className="text-sm text-zinc-500">Routes</p>
                    <Listbox
                        className="p-0"
                        aria-label="routes"
                        selectionMode="multiple"
                        hideEmptyContent
                        items={(usedAPITemplate as listApiWithSearchType).routes}
                        selectedKeys={selectedRoutes}
                        onSelectionChange={setSelectedRoutes}
                    >
                        {(data => <ListboxItem key={'/' + data.route} textValue={'/' + data.name}>
                            /{data.name}
                        </ListboxItem>
                        )}
                    </Listbox>
                    <p className="text-sm text-zinc-500">{selectedRoutes}</p>
                </>
            )}

            <ItemDirectAPILoaders
                selectedRoutes={selectedRoutesArray}
                onClose={onClose}
                setIsLoading={setIsLoading}
                setError={setError}
            />

            {(usedAPITemplate as listApiWithSearchType)?.searchTitlePath &&
                <Divider orientation="horizontal" className="mt-2 animate-fade-in" />}

            <ItemSearchAPILoaders
                selectedRoutes={selectedRoutesArray}
                setPageNumber={setPageNumber}
                setError={setError}
            />
        </>
    );
}

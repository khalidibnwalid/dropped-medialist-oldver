'use client'

import { listApiType, listApiWithSearchType } from "@/types/list";
import { Button, Divider, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import { Suspense, useContext, useEffect, useState } from "react";
import { ItemApiLoaderContext } from "./provider";
import { ItemDirectAPILoaders } from "./ItemDirectAPILoaders";
import { ItemSearchAPILoaders } from "./ItemSearchAPILoaders";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { BiErrorCircle } from "react-icons/bi";

function ItemApiModal() {

    const { isOpen, onOpenChange, usedAPITemplate, loadAPITemplate, searchResults, apiDataValuesPicker } = useContext(ItemApiLoaderContext);

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [pageNumber, setPageNumber] = useState<number>(0)
    const [selectedRoutes, setSelectedRoutes] = useState(new Set([]));
    const selectedRoutesArray = Array.from(selectedRoutes)

    useEffect(() => {
        setPageNumber(0)
        setError(null)
        setSelectedRoutes(new Set([]))
    }, [usedAPITemplate])

    function pickedTitle(result: object) {
        const title = apiDataValuesPicker({ title: (usedAPITemplate as listApiWithSearchType).searchTitlePath }, result)
        return title.title
    }

    function pickedResultToItemPath(result: object) {
        const path = apiDataValuesPicker({ path: (usedAPITemplate as listApiWithSearchType).searchResultToItem.path }, result)
        return path.path
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {error && `Error: ${usedAPITemplate?.name}`}
                            {pageNumber === 0 && !error && `API Search Queries: ${usedAPITemplate?.name}`}
                            {pageNumber === 1 && !error && `Search Results: ${usedAPITemplate?.name}`}
                        </ModalHeader>
                        {error ? <ErrorPage error={error} />
                            : (isLoading ? <Spinner className="py-5 animate-fade-in" label="Loading Data..." />
                                : (<>
                                    <ModalBody className="animate-fade-in">
                                        <>
                                            {pageNumber === 0 &&
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
                                                                {(data =>
                                                                    <ListboxItem key={'/' + data.route} textValue={'/' + data.name}>
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
                                                        <Divider orientation="horizontal" className="mt-2 animate-fade-in" />
                                                    }
                                                    <ItemSearchAPILoaders
                                                        selectedRoutes={selectedRoutesArray}
                                                        setPageNumber={setPageNumber}
                                                        setError={setError}
                                                    />
                                                </>
                                            }

                                            {pageNumber === 1 &&
                                                <div className="-mx-4 -my-2 animate-fade-in">
                                                    <Suspense fallback={<Spinner label="Loading..." />}>
                                                        <Listbox
                                                            aria-label="Api Search Results"
                                                            className="bg-accented rounded-lg overflow-y-auto"
                                                            onAction={async (key) => {
                                                                setIsLoading(true)
                                                                await loadAPITemplate(
                                                                    //should current
                                                                    usedAPITemplate as listApiType,
                                                                    (usedAPITemplate as listApiWithSearchType).searchResultToItem.query + key
                                                                )
                                                                setIsLoading(false)
                                                                onClose()

                                                            }}
                                                        >
                                                            {searchResults.search.map((result: object) => (
                                                                // doesn't get nested paths 'attributes::title::en'
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
                                                </div>
                                            }
                                        </>
                                    </ModalBody>
                                </>
                                ))}
                        <ModalFooter>
                            {(pageNumber > 0 && !error) &&
                                <Button
                                    color="primary"
                                    className=" shadow-lg"
                                    onPress={() => setPageNumber(0)}
                                >
                                    Back
                                </Button>
                            }
                            {(error) &&
                                <Button
                                    color="primary"
                                    className=" shadow-lg"
                                    onPress={() => { setPageNumber(0); setError(null) }}
                                >
                                    Try again
                                </Button>
                            }
                        </ModalFooter>
                    </>)
                }
            </ModalContent>
        </Modal >
    );

}

export default ItemApiModal

const ErrorPage = ({ error }: { error: string | null }) => (
    <div className="flex flex-col  items-center justify-center gap-y-3 p-5 animate-fade-in">
        <BiErrorCircle className="text-7xl text-danger/70 font-extralight" />
        <p className=" text-danger/70 text-xl">Error: {error}</p>
        <p className="text-zinc-500 text-md text-center px-5">Oops! Check your queries again </p>
    </div>
)
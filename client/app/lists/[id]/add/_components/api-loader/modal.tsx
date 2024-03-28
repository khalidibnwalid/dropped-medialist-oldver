'use client'

import { listApiType, listApiWithSearchType } from "@/types/list";
import { Button, Divider, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import { Suspense, useContext, useEffect, useState } from "react";
import { ItemApiLoaderContext } from "./provider";
import { ItemDirectAPILoaders } from "./ItemDirectAPILoaders";
import { ItemSearchAPILoaders } from "./ItemSearchAPILoaders";

function ItemApiModal() {

    const { isOpen, onOpenChange, usedAPITemplate, loadAPITemplate, searchResults, apiDataValuesPicker } = useContext(ItemApiLoaderContext);

    const [isLoading, setIsLoading] = useState(false)
    const [pageNumber, setPageNumber] = useState<number>(0)

    useEffect(() => {
        setPageNumber(0)

    }, [usedAPITemplate])

    //maybe use a system that doesn't diifernate between quries?
    //or just remove routes and replace them with empty query /////////////////
    // empty route => '/'

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
                            {pageNumber === 0 && `API Search Queries: ${usedAPITemplate?.name}`}
                            {pageNumber === 1 && `Search Results: ${usedAPITemplate?.name}`}
                        </ModalHeader>

                        {isLoading ? <Spinner className="py-5 animate-fade-in" label="Loading Data..." /> :
                            (<>
                                <ModalBody className="animate-fade-in">
                                    {pageNumber === 0 &&
                                        <>
                                            <ItemDirectAPILoaders onClose={onClose} setIsLoading={setIsLoading} />
                                            {(usedAPITemplate as listApiWithSearchType)?.searchTitlePath &&
                                                <Divider orientation="horizontal" className="mt-2 animate-fade-in" />
                                            }
                                            <ItemSearchAPILoaders setPageNumber={setPageNumber} />
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

                                </ModalBody>

                                <ModalFooter>
                                    {pageNumber > 0 &&
                                        <Button
                                            color="primary"
                                            className=" shadow-lg"
                                            onPress={() => { setPageNumber(0) }}
                                        >
                                            Back
                                        </Button>
                                    }
                                </ModalFooter>
                            </>)
                        }
                    </>
                )}
            </ModalContent>
        </Modal>
    );

}

export default ItemApiModal


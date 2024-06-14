import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import ItemAPIModalPageOne from "./ItemAPIModalPageOne";
import ItemAPIModalPageZero from "./ItemAPIModalPageZero";
import { ItemApiLoaderContext } from "./provider";

function ItemApiModal() {
    const { isOpen, onOpenChange, usedAPITemplate } = useContext(ItemApiLoaderContext);

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [pageNumber, setPageNumber] = useState<number>(0)
    const [selectedRoutes, setSelectedRoutes] = useState<Set<string>>(new Set([]));
    const selectedRoutesArray = Array.from(selectedRoutes)

    useEffect(() => {
        setPageNumber(0)
        setError(null)
        setSelectedRoutes(new Set([]))
    }, [usedAPITemplate])

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
                                : (
                                    <ModalBody className="animate-fade-in">
                                        <ItemAPIModalPageZero
                                            pageNumber={pageNumber}
                                            setPageNumber={setPageNumber}
                                            onClose={onClose}
                                            selectedRoutesArray={selectedRoutesArray}
                                            setIsLoading={setIsLoading}
                                            setError={setError}
                                            selectedRoutes={selectedRoutes}
                                            setSelectedRoutes={setSelectedRoutes}
                                        />

                                        <ItemAPIModalPageOne
                                            pageNumber={pageNumber}
                                            onClose={onClose}
                                            selectedRoutesArray={selectedRoutesArray}
                                            setIsLoading={setIsLoading}
                                        />
                                    </ModalBody>
                                ))
                        }

                        <ModalFooter>
                            {(error) ?
                                <Button
                                    color="primary"
                                    className=" shadow-lg"
                                    onPress={() => { setPageNumber(0); setError(null) }}
                                >
                                    Try again
                                </Button>
                                : pageNumber > 0 &&
                                <Button
                                    color="primary"
                                    className=" shadow-lg"
                                    onPress={() => setPageNumber(0)}
                                >
                                    Back
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
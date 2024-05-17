import type { itemData } from "@/types/item";
import type { listData } from "@/types/list";
import patchAPI from "@/utils/api/patchAPI";
import { mutateItemCache } from "@/utils/query/itemsQueries";
import { mutateListCache } from "@/utils/query/listsQueries";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiSolidPencil, BiSolidStar, BiSolidTrashAlt, BiStar } from "react-icons/bi";

type props = {
    data: itemData | listData;
    item?: boolean;
    children: React.ReactNode;
}

function EditDropDown({ data, item, children }: props) {
    const router = useRouter()

    const isTrashed = data.trash;
    const [isStared, setIsStared] = useState(data.fav);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const toggelStar = useMutation({
        mutationFn: () => patchAPI(`${item ? 'items' : 'lists'}/${data.id}`, { "fav": !isStared }),
        onSuccess: () => {
            data = { ...data, fav: !isStared }
            item
                ? mutateItemCache(data as itemData, 'edit')
                : mutateListCache(data as listData, 'edit')
            setIsStared(!isStared)
        },
    })

    const toggleTrash = useMutation({
        mutationFn: () => patchAPI(`${item ? 'items' : 'lists'}/${data.id}`, { "trash": !isTrashed }),
        onSuccess: () => {
            data = { ...data, trash: !isTrashed }
            if (item) {
                if (!isTrashed) router.push(`/lists/${(data as itemData).list_id}`)
                isTrashed
                    ? mutateItemCache(data as itemData, 'add')
                    : mutateItemCache(data as itemData, 'delete')
            } else {
                if (!isTrashed) router.push('/trash')
                isTrashed
                    ? mutateListCache(data as listData, 'add')
                    : mutateListCache(data as listData, 'delete')
            }
        }
    })

    function editPage() {
        router.push(`/${item ? 'items' : 'lists'}/${(data as itemData).id}/edit`);
    }

    return (
        <>
            <Dropdown className="flex-none" backdrop="opaque">
                <DropdownTrigger>
                    {children}
                </DropdownTrigger>

                <DropdownMenu aria-label="Edit DropDown">
                    {isStared
                        ? <DropdownItem
                            color="warning"
                            key="star-button"
                            className="text-warning"
                            onAction={() => toggelStar.mutate()}
                            startContent={< BiSolidStar className=" text-lg" />}
                        >
                            Unstar
                        </DropdownItem>
                        : <DropdownItem
                            color="warning"
                            key="star-button"
                            className="text-warning"
                            onAction={() => toggelStar.mutate()}
                            startContent={< BiStar className=" text-lg" />}
                        >
                            Star
                        </DropdownItem>
                    }

                    {/* Edit */}
                    <DropdownItem
                        key="edit-button"
                        startContent={< BiSolidPencil className=" text-lg" />}
                        onPress={editPage}
                    >
                        Edit
                    </DropdownItem>

                    {/* Move to Trash */}
                    {isTrashed
                        ? <DropdownItem
                            key="delete"
                            className="text-primary"
                            onPress={() => toggleTrash.mutate()}
                            color="primary"
                            startContent={< BiSolidTrashAlt className=" text-lg" />}
                        >
                            Restore
                        </DropdownItem>
                        : <DropdownItem
                            key="delete"
                            className="text-danger"
                            onPress={onOpen}
                            color="danger"
                            startContent={< BiSolidTrashAlt className=" text-lg" />}
                        >
                            Move to Trash
                        </DropdownItem>
                    }

                </DropdownMenu>
            </Dropdown>

            {/* Delete Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Are you sure?</ModalHeader>
                            <ModalBody>
                                <p>
                                    Do you really want to move it to Trash?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="bordered" onPress={() => toggleTrash.mutate()}>
                                    Move to Trash
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    No
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>

    )
}

export default EditDropDown;
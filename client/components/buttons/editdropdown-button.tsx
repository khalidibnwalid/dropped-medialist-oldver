import patchAPI from "@/utils/api/patchAPI";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSolidPencil, BiSolidStar, BiSolidTrashAlt, BiStar } from "react-icons/bi";
import type { itemData } from "@/types/item";
import type { listData } from "@/types/list";

type params = {
    data: itemData | listData;
    item?: boolean;
    list?: boolean;
    children: React.ReactNode;
}

function EditDropDown({ data, list, item, children }: params) {
    const router = useRouter()

    const [isStared, setIsStared] = useState(data.fav);
    const isTrashed = data.trash;

    function toggleStarState() {
        setIsStared(!isStared);
        patchAPI(`${item ? 'items' : 'lists'}/${data.id}`, { "fav": !isStared });
        router.refresh();
    }

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function deleteFunction() {
        router.push(`/lists/${item && (data as itemData).list_id}`);
        patchAPI(`${item ? 'items' : 'lists'}/${(data as itemData).id}`, { "trash": true });

    }

    function unTrashFunction() {
        router.push(`/lists/${item && (data as itemData).list_id}`);
        patchAPI(`${item ? 'items' : 'lists'}/${(data as itemData).id}`, { "trash": false });
    }

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
                    {isStared ?
                        <DropdownItem
                            color="warning"
                            key="star-button"
                            className="text-warning"
                            onAction={toggleStarState}
                            startContent={< BiSolidStar className=" text-lg" />}>
                            Unstar
                        </DropdownItem> :
                        <DropdownItem
                            color="warning"
                            key="star-button"
                            className="text-warning"
                            onAction={toggleStarState}
                            startContent={< BiStar className=" text-lg" />}>
                            Star
                        </DropdownItem>}

                    {/* Edit */}
                    <DropdownItem
                        key="edit-button"
                        startContent={< BiSolidPencil className=" text-lg" />}
                        onPress={editPage}
                    >
                        Edit
                    </DropdownItem>

                    {/* Move to Trash */}

                    {isTrashed ?
                        <DropdownItem
                            key="delete"
                            className="text-primary"
                            onPress={unTrashFunction}
                            color="primary"
                            startContent={< BiSolidTrashAlt className=" text-lg" />}
                        >
                            Restore
                        </DropdownItem>
                        :
                        <DropdownItem
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
                                <Button color="danger" variant="bordered" onPress={deleteFunction}>
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
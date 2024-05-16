import { itemData } from "@/types/item";
import type { listData } from "@/types/list";
import deleteAPI from "@/utils/api/deleteAPI";
import handleDeletedItemMedia from "@/utils/api/handlers/handleDeletedItemMedia";
import handleDeletedListMedia from "@/utils/api/handlers/handleDeletedListMedia";
import patchAPI from "@/utils/api/patchAPI";
import { Button, ButtonGroup, Card, Checkbox, CheckboxGroup, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, cn, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { BiCheck, BiRevision, BiTrashAlt } from "react-icons/bi"; //BoxIcons
import { FaEye } from "react-icons/fa";
import { authContext } from "../authProvider";

//item = false => list, and vice versa
function TrashSide({ dataArray, item }: { dataArray: listData[] | listData[], item?: boolean }) {
    const options = dataArray.map((data) => data.id)
    const [selectAll, setSelectAll] = useState(false)

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [groupSelected, setGroupSelected] = useState<string[]>([]);
    const router = useRouter();

    function clearTrash() {
        groupSelected.map((id) => item ? handleDeletedItemMedia(id) : handleDeletedListMedia(id))
        deleteAPI(item ? 'items' : 'lists', { body: groupSelected })
        setGroupSelected([])
        setSelectAll(false);
        router.refresh();
    }

    function restoreTrash() {
        patchAPI(item ? 'items/group' : 'lists/group', { id: groupSelected, trash: false })
        setGroupSelected([])
        setSelectAll(false);
        router.refresh();
    }

    function handleSelectAll() {
        // because how to stateHook works, when it is toggeled it will
        // schlude a change foe the value, the means it didn't change that will make the function work with the old state, instead.
        setSelectAll(prevState => {
            const newState = !prevState;
            newState ? setGroupSelected(options) : setGroupSelected([]);
            return newState;
        })
    }

    // screen companility / responsivability isn't good, need fixing.


    return (
        <>
            <div className="flex flex-col gap-x-1 gap-y-7 ">

                <div className="flex items-center flex-wrap gap-y-3 bg-accented p-3 pl-5 rounded-2xl shadow-lg">

                    <div className="flex items-center flex-grow" >
                        <BiTrashAlt className="text-3xl flex-none" />
                        <p className="pl-2 text-2xl flex-grow font-semibold">{item ? "Items" : "Lists"}</p>
                    </div>

                    <ButtonGroup className="flex-none shadow-lg bg:w-full rounded-xl">
                        <Button
                            className={` duration-200 ${selectAll ? 'bg-danger' : ''}`}
                            onPress={handleSelectAll}
                            isDisabled={options.length === 0 ? true : false}
                        >
                            <BiCheck className="text-xl" /> Select All
                        </Button>
                        <Button
                            onPress={restoreTrash}
                            isDisabled={groupSelected.length === 0 ? true : false}
                        >
                            <BiRevision className="text-lg" /> Restore
                        </Button>
                        <Button
                            onPress={onOpen}
                            isDisabled={groupSelected.length === 0 ? true : false}
                        >
                            <BiTrashAlt className=" text-lg" /> Delete
                        </Button>
                    </ButtonGroup>
                </div>

                <CheckboxGroup
                    value={groupSelected}
                    onChange={(e: any) => setGroupSelected(e)}>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-7 pl-4 animate-fade-in">
                        {dataArray?.map((data, index) =>
                            <CardCheckBox key={`${item ? 'item' : 'list'}-checkbox-${index}}`} data={data} item={item} />)
                        }
                    </div>

                </CheckboxGroup>
            </div>


            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Are you sure?</ModalHeader>
                            <ModalBody>
                                <p>
                                    This time it will be permanent!!
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="bordered" onPress={() => { clearTrash(); onClose(); }}>
                                    Delete (permanent)
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}


export default TrashSide;

function CardCheckBox({ data, item }: { data: listData | itemData, item?: boolean }) {
    const router = useRouter()
    const { userData } = useContext(authContext)

    return (
        <Checkbox
            key={`card ${data.title}`}
            value={data.id}
            classNames={{
                base: cn(
                    " aspect-[5/1] h-20",
                    "inline-flex w-full bg-content1 duration-200  shadow-lg",
                    "hover:bg-content2 items-center justify-start",
                    "cursor-pointer rounded-lg gap-2 p-3 border-5 border-transparent",
                    "data-[selected=true]:border-danger",
                ),
                label: "w-full",
            }}
            icon={<BiTrashAlt />}
            color="danger"
        >
            <div className="w-full flex gap-3 items-center">

                {!item && data.cover_path || (data as itemData).poster_path ? <Image
                    className="flex-none aspect-1 object-cover h-14"
                    alt={data.title}
                    src={`${process.env.PUBLIC_IMG_PATH}/users/${userData.id}/${item
                        ? `${(data as itemData).list_id}/${(data as itemData).id}`
                        : `${(data as listData).id}`}/${item
                            ? (data as itemData).poster_path
                            : data.cover_path}`}
                /> :
                    <Card
                        className=" flex-none uppercase font-light text-xl aspect-1 items-center justify-center bg-[#2f2f2f] h-14"
                        radius="lg"
                    >
                        {data.title[0]}
                    </Card>
                }
                <div className="flex flex-col items-start gap-1 flex-grow">
                    <span className="text-tiny text-default-500 ">{item ? 'Item' : ' List'}</span>
                    <p className="line-clamp-2">{data.title}</p>
                </div>
                <Button size="sm" radius="full"
                    className="bg-transparent hover:bg-[#3e3e3e]"
                    onPress={() => router.push(`${item ? 'Items' : 'lists'}/${data.id}`)}
                    isIconOnly>
                    <FaEye className="text-lg" />
                </Button>
            </div>
        </Checkbox>
    )
}

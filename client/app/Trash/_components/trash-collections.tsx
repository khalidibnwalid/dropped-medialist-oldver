'use client'
import type { CollectionData } from "@/types/collection";
import deleteAPI from "@/utils/api/deleteAPI";
import handleDeletedCollectionMedia from "@/utils/api/handlers/handleDeletedCollectionMedia";
import patchAPI from "@/utils/api/patchAPI";
import { Button, ButtonGroup, Checkbox, CheckboxGroup, Image, Modal, Card, ModalBody, ModalContent, ModalFooter, ModalHeader, cn, useDisclosure } from "@nextui-org/react";
import { IMG_PATH } from "@/app/page";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiCheck, BiRevision, BiTrashAlt } from "react-icons/bi"; //BoxIcons
import { FaEye } from "react-icons/fa";


function TrashCollections({ dataArray }: { dataArray: CollectionData[] }) {
    const options = dataArray.map((data) => data.id)
    const [selectAll, setSelectAll] = useState(false)

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [groupSelected, setGroupSelected] = useState([]);
    const router = useRouter();

    function clearTrash() {
        groupSelected.map((id) => handleDeletedCollectionMedia(id))
        deleteAPI('collections', { body: groupSelected })
        setGroupSelected([])
        setSelectAll(false);
        router.refresh();
    }

    function restoreTrash() {
        patchAPI('collections/rule/group', { id: groupSelected, trash: false })
        setGroupSelected([])
        setSelectAll(false);
        router.refresh();
    }

    function funSelectAll() {
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
                        <p className="pl-2 text-2xl flex-grow font-semibold">Collections</p>
                    </div>

                    <ButtonGroup className="flex-none shadow-lg bg:w-full rounded-xl">
                        <Button className={` duration-200 ${selectAll ? 'bg-danger' : ''}`} onPress={funSelectAll} isDisabled={options.length === 0 ? true : false}> <BiCheck className="text-xl" /> Select All</Button>
                        <Button onPress={restoreTrash} isDisabled={groupSelected.length === 0 ? true : false} ><BiRevision className="text-lg" /> Restore</Button>
                        <Button onPress={onOpen} isDisabled={groupSelected.length === 0 ? true : false} > <BiTrashAlt className=" text-lg" /> Delete</Button>
                    </ButtonGroup>
                </div>

                <CheckboxGroup
                    value={groupSelected}
                    onChange={setGroupSelected}>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-7 pl-4 animate-fade-in">
                        {dataArray?.map((data, index) => <CardCheckBox key={`col-checkbox-${index}}`} data={data} />)}
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


export default TrashCollections;

function CardCheckBox({ data }: { data: CollectionData }) {
    const router = useRouter()

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

                {data.cover_path ? <Image
                    className="flex-none aspect-1 object-cover"
                    alt={data.title}
                    src={`${IMG_PATH}/images/collections/${data.cover_path}`}
                /> :
                    <Card
                        className=" flex-none uppercase font-light text-xl 
                           aspect-1
                           items-center justify-center 
                          bg-[#2f2f2f]"
                        radius="lg"
                    >
                        {data.title[0]}
                    </Card>
                }
                <div className="flex flex-col items-start gap-1 flex-grow">
                    <span className="text-tiny text-default-500">Collection</span>
                    <p className="">{data.title}</p>
                </div>
                <Button size="sm" radius="full"
                    className="bg-transparent hover:bg-[#3e3e3e]"
                    onPress={() => router.push(`Collections/${data.id}`, { scroll: false })}
                    isIconOnly>
                    <FaEye className="text-lg" />
                </Button>
            </div>
        </Checkbox>
    )
}

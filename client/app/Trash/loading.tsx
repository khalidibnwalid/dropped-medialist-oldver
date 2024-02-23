'use client'
import { Button, ButtonGroup, Skeleton } from "@nextui-org/react";
import { BiCheck, BiRevision, BiTrashAlt } from "react-icons/bi"; //BoxIcons

export default function LoadingTrashPage() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-5 px-2 py-5 ">
                <div className="flex flex-col gap-x-1 gap-y-7 ">

                    <div className="flex items-center flex-wrap gap-y-3 bg-[#282828] p-3 pl-5 rounded-2xl shadow-perfect-md">

                        <div className="flex items-center gap-x-4 flex-grow" >
                            <BiTrashAlt className="text-3xl flex-none" />
                            <Skeleton className="flex-grow h-10 rounded-xl shadow-perfect-md" />
                        </div>

                        <ButtonGroup className="flex-none shadow-perfect-md bg:w-full">
                            <Button isDisabled> <BiCheck className="text-xl" /> Select All</Button>
                            <Button isDisabled><BiRevision className="text-lg" /> Restore</Button>
                            <Button isDisabled> <BiTrashAlt className=" text-lg" /> Delete</Button>
                        </ButtonGroup>
                    </div>

                </div>
                <div className="flex flex-col gap-x-1 gap-y-7 ">

                    <div className="flex items-center flex-wrap gap-y-3 bg-[#282828] p-3 pl-5 rounded-2xl shadow-perfect-md">

                        <div className="flex items-center gap-x-4 flex-grow">
                            <BiTrashAlt className="text-3xl flex-none" />
                            <Skeleton className="flex-grow h-10 rounded-xl shadow-perfect-md" />
                        </div>

                        <ButtonGroup className="flex-none shadow-perfect-md bg:w-full">
                            <Button isDisabled> <BiCheck className="text-xl" /> Select All</Button>
                            <Button isDisabled><BiRevision className="text-lg" /> Restore</Button>
                            <Button isDisabled> <BiTrashAlt className=" text-lg" /> Delete</Button>
                        </ButtonGroup>
                    </div>

                </div>
        </div>
    )
}
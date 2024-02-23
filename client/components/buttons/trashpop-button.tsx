'use client'

import { Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import React, { useState } from "react";
import { BiTrashAlt, BiX } from "react-icons/bi";

interface childProps {
    isTrashOpen: boolean
}

type children = (props: childProps) => JSX.Element;

type props = {
    onPress: any
    children: children
    placement?: "top" | "bottom" | "right" | "left" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end" | "right-start" | "right-end";
}


export const TrashPopover = ({ onPress, children, placement }: props) => {
    const [isTrashOpen, setIsTrashOpen] = useState(false);

    return (
        <Popover placement={placement} showArrow={true} isOpen={isTrashOpen} onOpenChange={(open) => setIsTrashOpen(open)}>
            <PopoverTrigger>
                {children && children({isTrashOpen})}
            </PopoverTrigger>
            <PopoverContent className="p-3">
                <p className="pb-3">Are you Sure?</p>
                <div className="flex items-center gap-x-2">
                    <Button
                        color="danger"
                        size="sm"
                        variant="bordered"
                        isIconOnly
                        onPress={onPress}
                    >
                        <BiTrashAlt className="text-2xl" />
                    </Button>
                    <Button
                        color="primary"
                        size="sm"
                        isIconOnly
                        onPress={() => setIsTrashOpen(false)}
                    >
                        <BiX className="text-2xl" />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
} 

'use client'

import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@nextui-org/react";
import React, { useContext } from "react";
import { ItemApiLoaderContext } from "./provider";

function ItemApiLoaderDropDown({ children }: { children: React.ReactNode }) {
    const { apiTemplates, onOpen, setUsedAPITemplate } = useContext(ItemApiLoaderContext)
    return (
        <Dropdown backdrop="opaque">
            <DropdownTrigger>
                {children}
            </DropdownTrigger>
            <DropdownMenu aria-label="Load API templates" className="max-w-52 overflow-hidden">
                <DropdownSection title="APIs">
                    {apiTemplates?.map((data) =>
                        <DropdownItem
                            key={'apiDropDown-' + data.name}
                            onClick={() => { setUsedAPITemplate(data); onOpen() }}>
                            {data.name}
                        </DropdownItem>
                    ) || <DropdownItem variant="light">No Added Api</DropdownItem>}
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}

export default ItemApiLoaderDropDown;
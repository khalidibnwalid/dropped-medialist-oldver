'use client'

import { useContext } from "react"
import { itemViewContext } from "../item-layouts"
import { Image } from "@nextui-org/react"
import { Button } from "@nextui-org/react"

function ItemLinks({ className }: { className?: string }) {
    const { itemData } = useContext(itemViewContext)

    return itemData.links &&
        <div className={className}>
            {itemData.links.map((link, index) => (
                <a href={link.url} target="_blank" key={`link-${index}`}>
                    <Button className=" capitalize font-bold text-opacity-80 w-full mb-3 shadow-lg hover:scale-[1.03]"
                        startContent={link.logo_path ?
                            <Image
                                src={`${process.env.PUBLIC_IMG_PATH}/images/logos/${link.logo_path}`}
                                className="object-contain h-6"
                                key={'link' + link.name}
                                alt={`link-logo ${link.url}`}
                            /> : undefined
                        }
                        key={link.name}>
                        {link.name}
                    </Button>
                </a>
            ))}
        </div>

}

export default ItemLinks

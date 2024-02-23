'use client'

import { useContext } from "react"
import { itemViewContext } from "../item-layouts"
import { Image } from "@nextui-org/react"
import { Button } from "@nextui-org/react"
import { IMG_PATH } from "@/app/page"

function ItemLinks() {
    const { itemData } = useContext(itemViewContext)

    return itemData.links &&
        <div>
            {itemData.links.map((data, index) => (
                <a href={data.url} target="_blank" key={`link-${index}`}>
                    <Button className=" capitalize font-bold text-opacity-80 
                                                w-full mb-3 shadow-perfect-md  
                                                hover:scale-[1.03] "
                        startContent={data.logo_path ?
                            <Image
                                src={`${IMG_PATH}/images/logos/${data.logo_path}`}
                                className="object-contain h-6"
                                key={data.logo_path}
                                alt={`link-logo ${data.url}`}
                            /> : undefined
                        }
                        key={data.name}>
                        {data.name}
                    </Button>
                </a>
            ))}
        </div>

}

export default ItemLinks

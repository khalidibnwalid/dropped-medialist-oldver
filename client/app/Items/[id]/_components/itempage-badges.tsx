'use client'
import type { itemBadgesType } from "@/types/item";
import { Chip, Image } from "@nextui-org/react";
import { FaStar } from "react-icons/fa";

type params = {
    badgesArray: itemBadgesType[];
}

function ItemBadges({ badgesArray }: params) {


    return (
        <div className="flex items-center gap-1">
            {badgesArray.map((data, index) => {
                if (data.logo_path === 'star') {
                    return (
                        <Chip
                            className=" opacity-90" variant="flat" key={`rating-${index}`}
                            avatar={<FaStar />} >
                            {data.value}
                            {data.value.length <= 1 && <> </> /* chips don't well with a single character */}
                        </Chip>
                    )
                } else if (data.logo_path) {
                    return (
                        <Chip
                            className=" opacity-90" variant="flat" key={`rating-${index}`}
                            avatar={data.logo_path && (
                                <Image
                                    className=" rounded-full object-contain"
                                    alt={`avatar-${index}`}
                                    src={`${process.env.PUBLIC_IMG_PATH}/images/logos/${data.logo_path}`}
                                />
                            )} >
                            {data.value}
                            {data.value.length <= 1 && <> </> /* chips don't well with a single character */}
                        </Chip>
                    )
                } else {
                    return (
                        <Chip
                            className=" opacity-90" variant="flat" key={`rating-${index}`}>
                            {data.value}
                            {data.value.length <= 1 && <> </> /* chips don't well with a single character */}
                        </Chip>
                    )
                }
            })
            }
        </div>

    )
}

export default ItemBadges;
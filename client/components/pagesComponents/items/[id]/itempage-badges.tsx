import type { itemBadgesType } from "@/types/item";
import { Chip, Image } from "@nextui-org/react";
import { useContext } from "react";
import { FaStar } from "react-icons/fa";
import { authContext } from "../../authProvider";
import { itemViewContext } from "@/pages/items/[id]";

type params = {
    badgesArray: itemBadgesType[];
}

function ItemBadges({ badgesArray }: params) {
    const { userData } = useContext(authContext)
    const { itemData } = useContext(itemViewContext)

    return (
        <div className="flex items-center gap-1">
            {badgesArray.map((badge, index) => {
                const dir = badge.logo_path?.startsWith('template_')
                    ? `${itemData.list_id}`
                    : `${itemData.list_id}/${itemData.id}`
                if (badge.logo_path === 'star') {
                    return (
                        <Chip
                            className=" opacity-90" variant="flat" key={`rating-${index}`}
                            avatar={<FaStar />} >
                            {badge.value}
                            {badge.value.length <= 1 && <> </> /* chips don't work well with a single character */}
                        </Chip>
                    )
                } else if (badge.logo_path) {
                    return (
                        <Chip
                            className=" opacity-90" variant="flat" key={`rating-${index}`}
                            avatar={badge.logo_path && (
                                <Image
                                    className=" rounded-full object-contain"
                                    alt={`avatar-${index}`}
                                    src={`${process.env.PUBLIC_IMG_PATH}/users/${userData.id}/${dir}/${badge.logo_path}`}
                                />
                            )} >
                            {badge.value}
                            {badge.value.length <= 1 && <> </> /* chips don't well with a single character */}
                        </Chip>
                    )
                } else {
                    return (
                        <Chip
                            className=" opacity-90" variant="flat" key={`rating-${index}`}>
                            {badge.value}
                            {badge.value.length <= 1 && <> </> /* chips don't well with a single character */}
                        </Chip>
                    )
                }
            })
            }
        </div>

    )
}

export default ItemBadges;
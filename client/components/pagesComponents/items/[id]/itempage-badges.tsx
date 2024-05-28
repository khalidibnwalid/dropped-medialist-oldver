import ImageChip from "@/components/cards/image-chip";
import { itemViewContext } from "@/pages/items/[id]";
import type { itemBadgesType, itemData } from "@/types/item";
import { Chip } from "@nextui-org/react";
import { useContext } from "react";
import { FaStar } from "react-icons/fa";
import { authContext } from "../../authProvider";

function ItemBadges({ badgesArray, item }: { badgesArray: itemBadgesType[], item?: itemData }) {
    const { userData } = useContext(authContext)
    const { itemData } = useContext(itemViewContext)

    return (
        <div className="flex items-center gap-1">
            {badgesArray.map((badge, index) => {
                const dir = badge.logo_path?.startsWith('template_')
                    ? `${itemData?.list_id || item?.list_id}`
                    : `${itemData?.list_id || item?.list_id}/${itemData?.id || item?.id}`
                if (badge.logo_path === 'star') {
                    return (
                        <Chip
                            className=" opacity-90" variant="flat" key={`rating-${index}`}
                            avatar={<FaStar />} >
                            {badge.value}
                            {badge.value.length <= 1 && <> </>}
                        </Chip>
                    )
                } else if (badge.logo_path) {
                    return (
                        <ImageChip
                            src={`${process.env.PUBLIC_IMG_PATH}/images/${userData.id}/${dir}/thumbnails/${badge.logo_path}_size=100xH.webp`}
                            key={`rating-${index}`}
                            value={badge.value}
                        />
                    )
                } else {
                    return (
                        <Chip
                            className=" opacity-90" variant="flat" key={`rating-${index}`}>
                            {badge.value}
                            {badge.value.length <= 1 && <> </>}
                        </Chip>
                    )
                }
            })
            }
        </div>
    )
}


export default ItemBadges;
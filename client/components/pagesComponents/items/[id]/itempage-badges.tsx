import ImageChip from "@/components/cards/image-chip";
import { itemViewContext } from "@/pages/items/[id]";
import type { itemData } from "@/types/item";
import { Chip } from "@nextui-org/react";
import { useContext } from "react";
import { FaStar } from "react-icons/fa";
import { authContext } from "../../authProvider";

function ItemBadges({ item }: { item?: itemData }) {
    const { userData } = useContext(authContext)
    const { itemData, tagsData } = useContext(itemViewContext)

    const Item: itemData = itemData || item

    const badgeableTags = tagsData?.filter((tag) => tag.badgeable)

    return (Item.badges || tagsData) && (
        <div className="flex items-center gap-1">
            {Item.badges?.map((badge, index) => {
                const dir = badge.logo_path?.startsWith('template_')
                    ? `${Item.list_id}`
                    : `${Item.list_id}/${Item.id}`
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
            })}

            {badgeableTags?.map((tag, index) =>
                <Chip
                    className=" opacity-90" variant="flat" key={`rating-${index}`}>
                    {tag.name}
                    {<> </>}
                </Chip>)
            }

        </div>
    )
}


export default ItemBadges;